#!/bin/bash

rm scans.zip
zip -r scans.zip api components middleware nuxt.config.js package.json package-lock.json plugins static assets layouts pages store

scp scans.zip pi4-scans:/home/scans
ssh pi4-scans -t ./rebuild.sh

ssh pi4-scans "rm scans.zip"
rm scans.zip
