#!/bin/bash

echo "Link fonts to iOS project"
input=".env"
while IFS= read -r line
do
  if [[ $line =~ APP_FLAVOR ]] ; then
    match=$line;
  fi
done < "$input"

app_flavor="$(cut -d'=' -f2 <<<"$match")"

if [ -z "$app_flavor" ]; then
  app_flavor="hsbc"
fi

echo "app flavor: ${app_flavor}"

cp -R "./assets/branding/${app_flavor}/fonts/" "./assets/fonts"
react-native link