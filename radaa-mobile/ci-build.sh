#!/bin/bash
# ci-build.sh - Fully automated Gradle build for Windsurf / EAS

set -e  # Stop on any error
set -o pipefail

echo "🚀 Starting Radaa Android build..."

# Step 1: Set Gradle wrapper timeout to prevent download timeouts
export GRADLE_WRAPPER_TIMEOUT=60000
echo "⏱ Gradle wrapper timeout set to $GRADLE_WRAPPER_TIMEOUT ms"

# Step 2: Pre-download Gradle if missing (optional, safest)
GRADLE_ZIP="./android/gradle-wrapper/gradle-8.14.3-bin.zip"
if [ ! -f "$GRADLE_ZIP" ]; then
  echo "📥 Gradle zip not found, downloading..."
  mkdir -p ./android/gradle-wrapper/
  curl -L -o "$GRADLE_ZIP" "https://services.gradle.org/distributions/gradle-8.14.3-bin.zip"
else
  echo "✅ Gradle zip already exists"
fi

# Step 3: Ensure wrapper points to local Gradle zip
GRADLE_WRAPPER_PROPS="./android/gradle/wrapper/gradle-wrapper.properties"
if ! grep -q "file:///" "$GRADLE_WRAPPER_PROPS"; then
  echo "🔧 Updating gradle-wrapper.properties to use local Gradle zip"
  sed -i.bak "s|distributionUrl=.*|distributionUrl=file://$(pwd)/android/gradle-wrapper/gradle-8.14.3-bin.zip|" "$GRADLE_WRAPPER_PROPS"
fi

# Step 4: Clean previous build artifacts
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Step 5: Run the release build
echo "🏗 Running Gradle release build..."
npx expo prebuild --clean
cd android
./gradlew :app:bundleRelease --no-daemon --stacktrace
cd ..

echo "✅ Build finished successfully!"
