#! /bin/bash

DIR="./.tmp";
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


cp -r api ./../src/

echo ""
echo "Job done ¯\_(ツ)_/¯"
echo ""
