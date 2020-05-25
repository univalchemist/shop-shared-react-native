//
//  CheckJailbreakModule.h
//  EmployeeFrontend
//
//  Created by tran dat on 2/27/20.
//  Copyright © 2020 CXAGroup. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <sys/stat.h>
#import <UIKit/UIKit.h>
#include <mach-o/dyld.h>
#include <assert.h>
#include <stdbool.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/sysctl.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <dlfcn.h>
#include "TargetConditionals.h"

#import <React/RCTEventEmitter.h>
#import <React/RCTUtils.h>
#import <React/RCTConvert.h>

NS_ASSUME_NONNULL_BEGIN

@interface CheckJailbreakModule : NSObject <RCTBridgeModule>

BOOL isJb();
BOOL isInjectedWithDynamicLibrary();
BOOL isSecurityCheckNotPassed();
BOOL isDebugged();
BOOL isFromAppStore();

@end

NS_ASSUME_NONNULL_END
