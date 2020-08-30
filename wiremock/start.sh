JAR_FILE_LOCATION="http://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone/2.14.0/wiremock-standalone-2.14.0.jar"
LOCAL_FILENAME="wiremock.jar"

if [ ! -e $LOCAL_FILENAME ]; then
	echo "Wiremock JAR does not exist.  Downloading..."
	wget -O $LOCAL_FILENAME $JAR_FILE_LOCATION > /dev/null 2>&1
fi

if [ $? -ne 0 ]; then
	echo "An error occurred downloading Wiremock JAR.  Aborting..."
	exit;
fi

echo "Starting Wiremock server..."
java -jar $LOCAL_FILENAME