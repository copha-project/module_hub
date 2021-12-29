#!/bin/sh
git pull
yarn run build
pm2 restart 0