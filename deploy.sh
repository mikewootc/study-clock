#!/bin/bash

rm -rf ./docs/*
cp -a ./dist/* ./docs/
# 将docs/index.html中的 '/assets/' 替换为 './assets/'
sed -i 's,\/assets\/,\.\/assets\/,g' ./docs/index.html

# vim:set tw=0:
