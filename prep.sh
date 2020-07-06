#! /bin/bash
yarn build
rm -rf mortgage
rm mortgage.zip
mv build mortgage
zip -r mortgage.zip mortgage