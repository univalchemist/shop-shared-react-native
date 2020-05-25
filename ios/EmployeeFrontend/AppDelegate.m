/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import <React/RCTHTTPRequestHandler.h>

#import <UMCore/UMModuleRegistry.h>
#import <UMReactNativeAdapter/UMNativeModulesProxy.h>
#import <UMReactNativeAdapter/UMModuleRegistryAdapter.h>
#import <React/RCTLinkingManager.h>
#import <Firebase.h>

#import "ReactNativeConfig.h"

@import Firebase;
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  
  if ([FIRApp defaultApp] == nil) {
      [FIRApp configure];
    }

  NSString *googleApiKey = [[[NSBundle mainBundle] infoDictionary] objectForKey: @"GoogleApiKey"];
  [GMSServices provideAPIKey:googleApiKey];
  self.moduleRegistryAdapter = [[UMModuleRegistryAdapter alloc] initWithModuleRegistryProvider:[[UMModuleRegistryProvider alloc] init]];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self
                                            launchOptions:launchOptions];
  RCTRootView *rootView =
      [[RCTRootView alloc] initWithBridge:bridge
                               moduleName:@"EmployeeFrontend"
                        initialProperties:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f
                                                    green:1.0f
                                                     blue:1.0f
                                                    alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [RNSplashScreen show];
  return YES;
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge {
  NSArray<id<RCTBridgeModule>> *extraModules = [_moduleRegistryAdapter extraModulesForBridge:bridge andExperience:nil];
  // You can inject any extra modules that you would like here, more information at:
  // https://facebook.github.io/react-native/docs/native-modules-ios.html#dependency-injection
  return extraModules;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
  return
      [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"
                                                     fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main"
                                 withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

@end

@interface RCTHTTPRequestHandler (SSLPinning) <NSURLSessionDataDelegate>
@end
@implementation RCTHTTPRequestHandler (SSLPinning)

- (NSArray *)pinnedCertificateData {
  NSArray<NSString *> *certNames = @[@"ca_cert"];
  NSMutableArray *localCertData = [NSMutableArray array];
  for (NSString* certName in certNames) {
    NSString *cerPath = [[NSBundle mainBundle] pathForResource:certName ofType:@"crt"];
    if (cerPath == nil) {
      @throw @"Can not load certicate given, check it's in the app resources.";
    }
    [localCertData addObject:[NSData dataWithContentsOfFile:cerPath]];
  }
  NSMutableArray *pinnedCertificates = [NSMutableArray array];
  for (NSData *certificateData in localCertData) {
    [pinnedCertificates addObject:(__bridge_transfer id)SecCertificateCreateWithData(NULL, (__bridge CFDataRef)certificateData)];
  }
  return pinnedCertificates;
}

- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential * _Nullable))completionHandler {
  BOOL shouldSecured = [[ReactNativeConfig envFor:@"SSL_PINNING"] boolValue];

  if (shouldSecured) {
    NSString *domain = challenge.protectionSpace.host;
    SecTrustRef serverTrust = [[challenge protectionSpace] serverTrust];

    NSArray *policies = @[(__bridge_transfer id)SecPolicyCreateSSL(true, (__bridge CFStringRef)domain)];

    SecTrustSetPolicies(serverTrust, (__bridge CFArrayRef)policies);
    SecTrustSetAnchorCertificates(serverTrust, (__bridge CFArrayRef)self.pinnedCertificateData);
    SecTrustResultType result;

    OSStatus errorCode = SecTrustEvaluate(serverTrust, &result);

    BOOL evaluatesAsTrusted = (result == kSecTrustResultUnspecified || result == kSecTrustResultProceed);
    if (errorCode == errSecSuccess && evaluatesAsTrusted) {
      NSURLCredential *credential = [NSURLCredential credentialForTrust:serverTrust];
      completionHandler(NSURLSessionAuthChallengeUseCredential, credential);
    } else {
      completionHandler(NSURLSessionAuthChallengeCancelAuthenticationChallenge, NULL);
    }
  } else {
    completionHandler(NSURLSessionAuthChallengePerformDefaultHandling, NULL);
  }  
}
@end
