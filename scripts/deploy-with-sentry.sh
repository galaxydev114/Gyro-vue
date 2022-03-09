set -euo pipefail

GYRO_ENVIRONMENT=${1-test}

echo "Deploy for: $GYRO_ENVIRONMENT"

echo "Version set in env ${APP_VERSION-none}"

test -f ./dist/version.txt && echo "Found version file, applying version" && export APP_VERSION=$(cat ./dist/version.txt)

if [ -z "${APP_VERSION-}" ]
then
    echo "Version of the deployment cannot be determined, exiting" && exit 1
else
    echo "App version to be deployed ${APP_VERSION}"

    sentry-cli releases new "$APP_VERSION"
    sentry-cli releases files "$APP_VERSION" upload-sourcemaps ./dist/pwa
    sentry-cli releases set-commits "$APP_VERSION" --auto --ignore-missing

    echo "Removing sourcemaps from build artifact"
    find ./dist/pwa -name '*.map' -delete
    find ./dist/pwa -regex '.*\.\(js\|css\)' -exec sed -i -E '\/[\*\/]#\ssourceMappingURL=.*(\.[0-9a-f]+)?\.(css|js)\.map(\*\/)?/g' {} +

    echo "Deploying to $GYRO_ENVIRONMENT"
    sh ./scripts/deploy.sh "$GYRO_ENVIRONMENT"
    sentry-cli releases finalize "$APP_VERSION"
fi