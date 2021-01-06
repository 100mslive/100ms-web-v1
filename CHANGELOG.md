# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.9.2 (2021-01-06)


### Features

* add deeplinking file for android ([3236cfd](https://github.com/100mslive/webapp-internal/commit/3236cfd1bac1e57f453813c02047c2db8598c7f2))
* allow changing settings mid call ([062400c](https://github.com/100mslive/webapp-internal/commit/062400c593ec61b7d212e4bce1d5e490456a3bff))
* allow chaning framerate before joining a meeting ([5abc4cf](https://github.com/100mslive/webapp-internal/commit/5abc4cf7fd6a2195bcde29c4a7a3750ab3f3e0fb))
* allow env choose only for internal apps ([26025ea](https://github.com/100mslive/webapp-internal/commit/26025ea65fc589916557c43ffa2b1e685087f45e))
* allow SFU host while building images ([6217bf5](https://github.com/100mslive/webapp-internal/commit/6217bf553bf58d35e927f14c8d1ab40f25529ebc))
* change event handlers to support the new SDK interface ([ec412fb](https://github.com/100mslive/webapp-internal/commit/ec412fb61a9ae7d3feef069bd6860e15f7ef9d31))
* change getLocalStream params as per SDK changes ([79e53b6](https://github.com/100mslive/webapp-internal/commit/79e53b69bb9aff2d9652ce61d5afb631666d47bc))
* enable deep linking in iOS app ([70d4433](https://github.com/100mslive/webapp-internal/commit/70d4433030b9cd5dde7e59c682bb26b5e52dd6bb))
* hide controls for live-record & viewer roles ([8a0bc69](https://github.com/100mslive/webapp-internal/commit/8a0bc692e7258bc3225a24e07a7bb2d50e47bd32))
* integrate logrocket for frontend logs ([dac14a2](https://github.com/100mslive/webapp-internal/commit/dac14a22c5da59b3cf66b9fdc626bbac0be84857))
* listen to client's disconnected event and reload the window ([56cd35e](https://github.com/100mslive/webapp-internal/commit/56cd35e003c47e878390d6259df17d6f519ed534))
* remove browser check and let the app be opened in all browsers ([6c36c44](https://github.com/100mslive/webapp-internal/commit/6c36c440a73033d999a1c29640b351522f8274f7))
* show codec option in settings only pre-call ([f736c9d](https://github.com/100mslive/webapp-internal/commit/f736c9decf04b96a0f4f424cc66b70652eabee68))
* show notification and send the user back to login when there's an error in subscribe ([8e3e234](https://github.com/100mslive/webapp-internal/commit/8e3e234e4a7b8e9e35adc2b89c53aa335427182a))
* viewer only role ([165eee8](https://github.com/100mslive/webapp-internal/commit/165eee81a9be8e5e5a02f9ba3d2f18fb64f76842))
* **live-record:** parse `mode` urlparam ([fc46994](https://github.com/100mslive/webapp-internal/commit/fc46994626e29c5fdcf55791b9d2dfa4109ccfe4))
* pick token generation endpoint from ENV ([61644b9](https://github.com/100mslive/webapp-internal/commit/61644b9ca8d119efcfcc9531352216ab60b966f0))
* send user_name to token service instead of peer_id and use latest sdk ([9748b46](https://github.com/100mslive/webapp-internal/commit/9748b4689552b6ac9673b0c12d09afe99ca1e466))
* teardown the meeting whenever HMSClient fires an 'disconnected' event ([3b006b8](https://github.com/100mslive/webapp-internal/commit/3b006b8b3d72e814ff186d2291da3f3a7436cc71))
* use canary sdk ([3bd85ae](https://github.com/100mslive/webapp-internal/commit/3bd85ae136bbf0982c95358a2ede28deb9e14804))
* use canary version of SDK and pass localStream to applyConstraints ([15fe286](https://github.com/100mslive/webapp-internal/commit/15fe28615373587984d15229964d1bbc80c18b14))


### Bug Fixes

* remove conten-type headers ([690f34c](https://github.com/100mslive/webapp-internal/commit/690f34cdb89fef2bce9c3f68b7bd6cce6fed7b39))
* **LoginForm:** content-type header value ([9c8d314](https://github.com/100mslive/webapp-internal/commit/9c8d314e451e7271ec80ac95f2e7a59e7506c06a))
* add better settings for screenshare ([5cf465f](https://github.com/100mslive/webapp-internal/commit/5cf465fd01d93aa0f7b15b38bc8201024a3ff87e))
* add correct logs for web socket and webrtc disconnects/fails ([d2b1491](https://github.com/100mslive/webapp-internal/commit/d2b1491c40a83577f5705d21f5c649f9833366c6))
* change advanced to advancedMediaConstraints as per the latest SDK changes ([3d4ee71](https://github.com/100mslive/webapp-internal/commit/3d4ee7174c4b9ef27353bcbcd78ea9dcc2bd27fb))
* change all brytecam references to 100ms ([cdb4925](https://github.com/100mslive/webapp-internal/commit/cdb492545b3f4e64e62ab214b1f3d884b870fe15))
* change LocalStream.getUserMedia to client.getLocalStream ([9767600](https://github.com/100mslive/webapp-internal/commit/9767600af7b1abf181cfa618130a01bcd17e0770))
* change site URL to 100ms.live ([4b5eb49](https://github.com/100mslive/webapp-internal/commit/4b5eb4994925b681dd621c9ca41da5dae629c334))
* fix error in testUpdateloop inside login form ([eee8e7b](https://github.com/100mslive/webapp-internal/commit/eee8e7bea8849afa5ba6f58f9467c5cb682ee3b9))
* fix room joining after leaving a previous room ([bf4a8da](https://github.com/100mslive/webapp-internal/commit/bf4a8da86a1bb00510847e92e7ed828db15e5259))
* make chat button visible to viewer role ([c45abd3](https://github.com/100mslive/webapp-internal/commit/c45abd3bc68a046721b6d63b6cba0713022a3732))
* **live-record:** disable audio-video publish ([cc5e343](https://github.com/100mslive/webapp-internal/commit/cc5e343a7cd6911ff67ea7b6350875a51f67e4a0))
* duplicate stream issue on web app ([c9f0ef3](https://github.com/100mslive/webapp-internal/commit/c9f0ef3ef6d956b4a92108ba78ceda9defbd6b58))
* merge latest changes from main and refactor getToken ([2fdfaa2](https://github.com/100mslive/webapp-internal/commit/2fdfaa2d51d6ccc2813a5c5f1d4acba78ed88836))
* provide Content-Type header in fetch ([62906a7](https://github.com/100mslive/webapp-internal/commit/62906a73581055152fae9b692197be34530cac7a))

### [0.9.1](https://github.com/100mslive/sample-app-web/compare/v0.9.0...v0.9.1) (2020-12-03)

### 0.8.1 (2020-11-17)


### Features

* pick token generation endpoint from ENV ([61644b9](https://github.com/100mslive/sample-app-web/commit/61644b9ca8d119efcfcc9531352216ab60b966f0))
