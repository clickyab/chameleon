#!/usr/bin/env bash
#set -x
set -eo pipefail

# This job is from jenkins. so kill it if it is a pull request
exit_message() {
    echo ${1:-'exiting...'}
    code=${2:-1}
    if [ "${code}" == "0" ]
    then
        echo "${APP}:${BRANCH}.${COMMIT_COUNT}" >> ${OUT_LOG}
        echo "Build was OK, but its not the correct branch(${APP}:${BRANCH}.${COMMIT_COUNT} By ${CHANGE_AUTHOR}). ignore this" >> ${OUT_LOG}
        echo "green" > ${OUT_LOG_COLOR}
    else
        echo "${APP}:${BRANCH}.${COMMIT_COUNT}" >> ${OUT_LOG}
        echo "Build was NOT OK(${APP}:${BRANCH}.${COMMIT_COUNT} By ${CHANGE_AUTHOR}). verify with dev team" >> ${OUT_LOG}
        echo "red" > ${OUT_LOG_COLOR}
    fi;
    exit ${code}
}

OUT_LOG=${OUT_LOG:-/dev/null}
OUT_LOG_COLOR=${OUT_LOG_COLOR:-/dev/null}
echo "red" > ${OUT_LOG_COLOR}
echo ""> ${OUT_LOG}

APP=${APP:-}
PROJECT=${PROJECT:-ccc}
BRANCH=${BRANCH_NAME:-master}
BRANCH=${CHANGE_TARGET:-${BRANCH}}

PUSH="--push"
[ -z ${CHANGE_AUTHOR} ] || PUSH=""
[ -z ${APP} ] && exit_message "The APP is not defined." # WTF, the APP NAME is important

SCRIPT_DIR=$(readlink -f $(dirname ${BASH_SOURCE[0]}))

SOURCE_DIR=${1:-}
[ -z ${SOURCE_DIR} ] && exit_message "Must pass the source directory as the first parameter" 1
SOURCE_DIR=$(cd "${SOURCE_DIR}/" && pwd)

BUILD_DIR=${2:-$(mktemp -d)}
CACHE_DIR=${3:-${SOURCE_DIR}-cache}
ENV_DIR=$(mktemp -d)

mkdir -p "${BUILD_DIR}" "${CACHE_DIR}" "${ENV_DIR}"
BUILD=$(cd "${BUILD_DIR}/" && pwd)
CACHE=$(cd "${CACHE_DIR}/" && pwd)
VARS=$(cd "${ENV_DIR}/" && pwd)

BUILD_PACKS_DIR=$(mktemp -d)

# Extract build data
pushd ${SOURCE_DIR}
GIT_WORK_TREE=${BUILD} git checkout -f HEAD

export LONG_HASH=$(git log -n1 --pretty="format:%H" | cat)
export SHORT_HASH=$(git log -n1 --pretty="format:%h"| cat)
export COMMIT_DATE=$(git log -n1 --date="format:%D-%H-%I-%S" --pretty="format:%cd"| sed -e "s/\//-/g")
export IMP_DATE=$(date +%Y%m%d)
export COMMIT_COUNT=$(git rev-list HEAD --count| cat)
export BUILD_DATE=$(date "+%D/%H/%I/%S"| sed -e "s/\//-/g")
popd

# Populate env for herokuish
env -0 | while IFS='=' read -r -d '' n v; do
    echo "${v}">"${VARS}/${n}";
done< <(env -0)

TEMPORARY=$(mktemp -d)
git clone https://github.com/fzerorubigd/swagger-ui.git ${TEMPORARY}/dist/swagger

cat > ${TEMPORARY}/default.conf <<EONGINX
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        try_files \$uri \$uri/ /index.html;
        index  index.html index.htm;
        add_header 'Access-Control-Allow-Origin' "$http_origin" always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
        # required to be able to read Authorization header in frontend
        # add_header 'Access-Control-Expose-Headers' 'Authorization' always;
    }
}
EONGINX

cat > ${TEMPORARY}/run.sh <<EORUN
#!/bin/sh

if [ \$URL != "**None**" ]; then
  SAFE_URL=\${URL//\//\\\/}
  sed -i "s/http:\/\/petstore.swagger.io\/v2\/swagger.json/\${SAFE_URL}/g" /usr/share/nginx/html/swagger/index.html
fi

exec nginx -g 'daemon off;'
EORUN

# Create Rockerfile to build with rocker (the Dockerfile enhancer tool)
cat > ${TEMPORARY}/Rockerfile <<EOF
FROM node:8

MOUNT {{ .Build }}:/clickyab/app
MOUNT {{ .Cache }}/node_modules:/clickyab/app/node_modules
MOUNT ${TEMPORARY}/dist:/clickyab/app/dist

ENV TZ=Asia/Tehran
RUN ln -snf /usr/share/zoneinfo/\$TZ /etc/localtime && echo \$TZ > /etc/timezone
WORKDIR /clickyab/app

RUN cd /clickyab/app && \
    npm install && \
    npm run syncTranslation && \
    npm run build

FROM nginx:1-alpine

ENV URL **None**
ADD run.sh /run.sh
ADD default.conf /etc/nginx/conf.d/default.conf
ADD dist /usr/share/nginx/html
ENV TZ=Asia/Tehran
RUN chmod a+x /run.sh && ln -snf /usr/share/zoneinfo/\$TZ /etc/localtime && echo \$TZ > /etc/timezone

CMD ["/run.sh"]

TAG registry.clickyab.ae/clickyab/{{ .App }}:{{ .Version }}
PUSH registry.clickyab.ae/clickyab/{{ .App }}:{{ .Version }}
TAG registry.clickyab.ae/clickyab/{{ .App }}:latest
PUSH registry.clickyab.ae/clickyab/{{ .App }}:latest

EOF

TARGET=$(mktemp -d)
pushd ${TEMPORARY}
# Actual build
rocker build ${PUSH} -var Build=${BUILD} -var EnvDir=${VARS} -var Cache=${CACHE} -var Target=${TARGET} -var Version=${COMMIT_COUNT} -var App=${APP}_${BRANCH}
popd

echo "${VARS}" >> /tmp/kill-me
echo "${TARGET}" >> /tmp/kill-me
echo "${TEMPORARY}" >> /tmp/kill-me
echo "${BUILD_DIR}" >> /tmp/kill-me
echo "${BUILD_PACKS_DIR}" >> /tmp/kill-me

[ -z ${CHANGE_AUTHOR} ] || exit_message "It's a PR, bail out" 0
if [[ ( "${BRANCH}" != "master" ) && ( "${BRANCH}" != "deploy" ) ]]; then
    exit_message "Its not on correct branch, bail out" 0
fi

echo "${APP}:${BRANCH}.${COMMIT_COUNT}" >> ${OUT_LOG}
echo "The branch ${BRANCH} build finished, try to deploy it" >> ${OUT_LOG}
echo "If there is no report after this for successful deploy, it means the deploy failed. report it please." >> ${OUT_LOG}
kubectl -n ${PROJECT} set image deployment  ${APP}-${BRANCH} ${APP}-${BRANCH}=registry.clickyab.ae/clickyab/${APP}_${BRANCH}:${COMMIT_COUNT} --record
echo "Deploy done successfully to image registry.clickyab.ae/clickyab/${APP}:${BRANCH}.${COMMIT_COUNT}" >> ${OUT_LOG}
echo "green" > ${OUT_LOG_COLOR}
