#!/bin/sh

npm install jest@26.6.3
npm install react-tippy@1.4.0
npm install jsoneditor@9.6.0
npm run bootstrap
npm run test-shared-lib
npm run test-ci --prefix ./compass