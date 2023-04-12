#!/bin/sh
git pull && yarn install && yarn build && pm2 start