set -euo pipefail

GYRO_ENVIRONMENT=${1-test}

echo "Building with sourcemaps for: $GYRO_ENVIRONMENT"

COMMIT_HASH=$(git log -n 1 --pretty=format:'%H' | cut -c1-7)
export APP_VERSION="$npm_package_name@$npm_package_version-$COMMIT_HASH"
export QENV="$GYRO_ENVIRONMENT"

echo "Building app version ${APP_VERSION}"
quasar build -m pwa -d

echo "Writing version file"
echo "$APP_VERSION" > ./dist/version.txt

echo "Build complete"