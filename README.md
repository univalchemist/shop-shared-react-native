# Employee Frontend (React Native)

## Table of contents

- [Tech stack](#tech-stack)
- [Tests](#tests)
- [Development](#development)
  - [Sentry](#sentry)
    - [Running in dev mode](#running-in-dev-mode)
      - [iOS](#ios)
      - [Android](#android)
    - [Running in release mode](#running-in-release-mode)
      - [iOS](#ios)
      - [Android](#android)
  - [Starting iOS](#starting-ios)
  - [Starting android](#starting-android)
  - [Running on Device (Android)](<#Running-on-Device-(android)>)
  - [Running on Device (iOS)](<#Running-on-Device-(ios)>)
  - [API calls](#api-calls)
  - [Android gotchas](#android-gotchas)
  - [Static image resources](#static-image-resources)
- [Configuration](#configuration)

## Tech stack

1. React (16.8.3)
2. Redux (4)
3. Redux-Thunk
4. Redux-Promise-Middleware
5. Jest
6. React-Native-Testing-Library
7. Axios

## Tests

```
yarn test
```

## Development
Config Nexus account for private npm (contact your leader to request credentials)
```
npm adduser --registry=https://repository.cxanow.com/repository/npm-group
```
Open `~/.npmrc` to copy your npm token and replace content file by a new one:
```
//repository.cxanow.com/repository/:_authToken=NpmToken.yourToken
//repository.cxanow.com/repository/npm-group/:_authToken=NpmToken.yourToken
registry=https://repository.cxanow.com/repository/npm-group/
email=yourEmail
always-auth=true%
```

Install dependencies

```
yarn install
```

Next, you need to link related native modules. Note that this command will hang uncompleted on node 8. It will complete on node 10.

```
react-native link
```

Lastly, you need to install iOS native dependencies by running the following command in `ios` folder.

```
gem install bundler:2.0.1
bundle install
bundle exec pod install
```

While doing `bundle exec pod install` if it complains like this:

```
checking whether the C compiler works... no
xcrun: error: SDK "iphoneos" cannot be located
xcrun: error: SDK "iphoneos" cannot be located
xcrun: error: SDK "iphoneos" cannot be located
```

Run this following command, after this continue doing, bundle exec pod install

```
sudo xcode-select --switch /Applications/Xcode.app
```
### Structure
    .
    ├── ...
    ├── components              # Shared components between different screens
    ├── screens                 # Screen components and local components only use for 1 screen
    ├── wrappers                    
    │   ├── components          # Components wrapper from @cxa-rn/components
    │   └── core                # All core functions wrapper from @cxa-rn/core
    └── ...

### Sentry

You might need to login with sentry account `palawan@cxagroup.com`.
Please ask the team members for the account details. Invitations will be sent to our cxagroup email

Sentry configuration are initialized in `./src/config/sentry.js`
This configuration is called in `./index.js`

#### Running in dev mode

Currently we have disabled errors to be sent over to sentry in dev mode.

##### IOS

- `yarn ios` to run application in ios simulator
- Generate the bundle by placing this in your browser `http://localhost:8081/index.bundle?platform=ios&dev=true&minify=false`
- Ensure to update your sourceMappingUrl at the last line of the `index.bundle` file to point to `index.bundle.map`
- Generate the bundle map by placing this in your browser `http://localhost:8081/index.bundle.map?platform=ios&dev=true&minify=false`
- Save both files and place them in a folder called `output_ios` . You might have to create this directory at the root of your project
- Run this command to upload generated files to sentry. Before running this command, make sure your have a `.sentryclirc` at your `~` location of your machine. Example of `.sentryrclirc` will be as follows:

```
[defaults]
org=cxa-group-pte-ltd
project=distribution-employee-mobile

[auth]
token=<get token from the sentry account>
```

```
sentry-cli releases \
    files com.cxagroup.mobile.EmployeeFrontend-1.0 \
    upload-sourcemaps  --ignore node_modules \
    --dist 1 \
    --strip-prefix <root_project>/output_ios \
    --rewrite --validate <root_project>/output_ios/index.bundle <root_project>/output_ios/index.bundle.map
```

- Trigger error on your application. App will crash. Reload and the crash will be sent to sentry. Sentry dashboard will updated in a few minutes

##### Android

Seems to encounter wrong line number in android. To be further investigated

#### Runnning in release mode

Running the commands below will automatically generate source maps and upload them to sentry

##### IOS

Ensure your xcode has the proper team account, provision profile and signing certificate. Please ask Devops for these credentials
`react-native run-ios --configuration Release`

##### Android

Ensure you have `android-release.keystore` located in your `./android/app`.
This can be generated as follows:

```
keytool -genkeypair \
        -noprompt \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -alias android-release-key \
        -dname "CN=com.employeefrontend, OU=MobileDevelopers, O=CXA, L=Singapore, ST=Singapore, C=SG" \
        -keystore android/app/android-release.keystore \
        -storepass password \
        -keypass password
```

The passwords used above should also be in ~/.gradle/gradle.properties:

```
RELEASE_STORE_PASSWORD=password
RELEASE_KEY_PASSWORD=password
```

After generating keystore, cd into `android` folder run `./gradlew assembleRelease`

If you are encoutering task-related errors, it may help to run `./gradlew clean && ./gradlew assembleRelease` to clean project and then run the assembleRelease task

Once signed apk is generated, run your android simulator and run `react-native run-android --variant=release`. This will install the signed apk onto your android simulator.

### Starting IOS

Prerequisites:
Install XCode with build tools (version 10.1)

```
yarn ios
```

### Starting Android

Prerequisites:

- Install Android Studio
- Setup a virtual device in Android Device Manager (ensure Android Pie 9.0)
- Run the virtual device. Start the device from command line for internet access (otherwise the device has access to DNS service): - `emulator @Nexus_S_API_28 -dns-server 8.8.8.8` (get the name of your device from AVD manager)
  If `emulator` is not available, the Android sdk tools are probably not in your PATH variable.

```
[MAC]
export ANDROID_HOME=/Users/{yourName}/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

[Windows] set ANDROID_HOME=C:\{installation location}\android-sdk
```

- Start application

```
yarn android
```

### Running on Device (Android)

To run the app on physical device:

1. Kill any emulated Android device that's running
2. Plug your Android device into the dev machine via USB
3. Enable USB debugging in developer options [link](https://developer.android.com/studio/debug/dev-options)
4. Open a terminal and run `adb devices`, you should see an identifier for your phone.
5. Run `react-native run-android` and an APK should be copied and installed to your phone. The app will start automatically when ready.
6. The device will not have access to localhost. We have used `ngrok` to tunnel localhost via a public server for development. Install this tool with `brew cask install ngrok`. Copy-paste the hostname provided by ngrok into the `Config/index.js` file into the API_HOST constant.

### Running on Device (iOS)

Note that if you are using CXA office WiFi, you will not be able to run in debug mode on the device.
This is because debug mode relies on the RN server to be running on your laptop, whereas release mode packages the metro server into the bundle installed on the device.

Debug mode therefore requires both laptop and device to be on the same WiFi network, with the metro port available (8080). Our devices are not allowed onto the vendor network, and the guest network only allows port 80 and 443.

Therefore - we have to run release mode on the device!

CLI style:

```
react-native run-ios --configuration Release --device="CXAs iPhone"
```

GUI Style: (XCode 10.x):

- Product > Scheme > Edit Scheme... [Command <]
- On the left pane select "Run"
- On the right pane in "Build Configuration" dropdown, select "Release"

### Android gotchas

- Android virtual device is firewalled and cannot reach your machine's localhost at "localhost". You will have to use 10.0.2.2. [Please see](https://developer.android.com/studio/run/emulator-networking)

### Static image resources

- For all images imported to the codebase, we will need the `2x` and `3x` version of the image to allow for different screen densities. [Please see](https://facebook.github.io/react-native/docs/images). All images are currently placed in src > images.
- We are able to export `2x` and `3x` version of the image from `figma`

## Configuration

This application uses [`react-native-config`](https://github.com/luggit/react-native-config) to provide build configuration for JavaScript and the native counterparts.

For development, copy [`.env.example`](https://github.com/cxagroup/distribution-employee-mobile/blob/master/.env.example) as `.env` file in the project directory and replace the values as required.
