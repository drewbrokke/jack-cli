#!/bin/bash

echo "Transpiling Typescript files..."
echo ""

tsc --pretty && echo "No build errors!"

echo ""
echo "Linting Typescript files..."
echo ""

tslint -c tslint.json -p tsconfig.json -t stylish && echo "No lint errors!"

echo ""