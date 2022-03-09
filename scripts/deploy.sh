bucket_name="gyro"
env=""
if [ "$1" = "prod" ];
then
	env="prod"
	cfdistid="E3RE9BT4GYUP7B"
elif [ "$1" = "staging" ];
then
	env="staging"
	cfdistid="EE3Z1X4OWMFPB"
elif [ "$1" = "test" ];
then
	env="test"
	cfdistid="E2UYK84C8H3LYO"
fi

if [ -z $env ];
then
	echo "argument is not correct prod | staging | test"
else
	echo "*****start deploying novos gyro version to s3 bucket $bucket_name-$env*****"
	aws s3 sync ./dist/pwa s3://$bucket_name-$env --delete --acl public-read --cache-control 'public, max-age=604800, immutable'
	if [ ! -z $cfdistid ]
	then
		aws cloudfront create-invalidation --distribution-id $cfdistid --paths "/*"
	fi
fi


