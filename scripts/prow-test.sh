#!/bin/sh

npm run bootstrap
npm run test-shared-lib
npm run test-ci --prefix ./compass