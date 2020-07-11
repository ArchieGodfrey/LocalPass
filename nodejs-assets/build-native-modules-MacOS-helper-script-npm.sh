#!/bin/bash
      # Helper script for Gradle to call npm on macOS in case it is not found
      export PATH=$PATH:/usr/local/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/archiegodfrey/Desktop/localPass/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/archiegodfrey/Desktop/localPass/node_modules/.bin:/usr/local/opt/ruby/bin:/usr/local/opt/ruby/bin:/usr/local/opt/ruby/bin:/Users/archiegodfrey/google-cloud-sdk/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin:/Library/Frameworks/Mono.framework/Versions/Current/Commands
      npm $@
    