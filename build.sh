#!/bin/bash

echo "Transpiling Typescript files..."
echo ""

tsc --pretty

echo ""
echo "Linting Typescript files..."
echo ""

tslint -c tslint.json -p tsconfig.json -t stylish

echo ""