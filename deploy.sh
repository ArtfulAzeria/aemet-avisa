#!/bin/bash

cd "$(dirname "$0")"
npx tsc
node dist/src/Main.js