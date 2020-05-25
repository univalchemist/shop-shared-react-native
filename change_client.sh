#!/usr/bin/env bash

next_client=$1

input=".env"
while IFS= read -r line
do
  if [[ $line =~ DEFAULT_CLIENT_NAME ]] ; then
    match=$line;
  fi
done < "$input"

prev_client="$(cut -d'=' -f2 <<<"$match")"

if [ -z "$prev_client" ]; then
  prev_client="hsbc"
fi

echo "Previous client: ${prev_client}"
echo "Next client: ${next_client}"

printf "\nDo you want to proceed? [y/n] : "
read -r input

if [[ "$input" == "y" ]] || [[ "$input" == "yes" ]]; then
  mv .env .env.${prev_client}
  mv .env.${next_client} .env

  echo "Done!"
fi
