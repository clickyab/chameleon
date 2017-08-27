#! /bin/bash

DIR="./.tmp";
SRC_DIR="./../src/api";
JSON_URL="http://staging.crab.clickyab.ae/api/misc/swagger/index.json"
SWAGGER_CLI_URL="https://oss.sonatype.org/content/repositories/releases/io/swagger/swagger-codegen-cli/2.2.3/swagger-codegen-cli-2.2.3.jar"
SWAGGER_FILE_NAME="swagger-codegen-cli-2.2.3.jar"

# Check DIRECTORY and cd to DIRECTORY
if [ ! -d "$DIR" ]; then
  mkdir -p $DIR;
fi
cd $DIR;

# Download and extract swagger
if [ -f "$SWAGGER_FILE_NAME" ]; then
	echo "$SWAGGER_FILE_NAME is exist."
else
	echo "Downloading swagger-codegen-cli v2.3.3"
  wget $SWAGGER_CLI_URL
  echo "Downloading done"
fi


# Generate Codes
rm -rf $DIR/api

echo "Generate Codes"
java -jar $SWAGGER_FILE_NAME  generate \
     -t ./../lib/swagger-template \
     -i $JSON_URL \
     -o ./api \
     -l typescript-fetch

sed -i '/token:/{
  s/token:/token?:/g
}' "api/api.ts"

sed -i '/throw new Error/{
  s/throw new Error("Missing required parameter token.*/params\["token"\] = AAA.getInstance().getToken();/g
}' "api/api.ts"


rm -f $SRC_DIR
cp -a api/. "$SRC_DIR";
rm -f $SRC_DIR/.gitignore
rm -f $SRC_DIR/README.md
rm -f $SRC_DIR/tslint.json
rm -f $SRC_DIR/package.json
rm -f $SRC_DIR/.swagger-codegen
rm -f $SRC_DIR/.swagger-codegen-ignore
rm -f $SRC_DIR/git_push.sh
rm -f $SRC_DIR/tsconfig.json


echo ""
echo "Job done ¯\_(ツ)_/¯"
echo ""
