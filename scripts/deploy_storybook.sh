bucket_name="gyro-storybook"

echo "*** Start deploying storybook to S3 bucket $bucket_name ***"

aws s3 sync ./storybook-static s3://$bucket_name --delete --acl public-read --cache-control 'public, max-age=604800, immutable'
