#!/bin/sh
git stash
git fetch
git rebase
git stash pop
yarn run build
pm2 restart 0