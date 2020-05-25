#!/bin/bash

set -e

echo "Creating an upload resource and fetching the upload URL"

upload_data=$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-API-Token: '$APP_CENTER_KEY 'https://api.appcenter.ms/v0.1/apps/palawan-appcenter/Employee-Mobile-IOS/release_uploads')
upload_id=`echo $upload_data | jq -r '.upload_id'`
upload_url=`echo $upload_data | jq -r '.upload_url'`

echo "Uploading the IPA"

upload_success=$(curl -F "ipa=@ios/build/EmployeeFrontend.ipa" $upload_url)

echo "IPA Uploaded"

echo "Commiting the IPA and getting the release url"

release_data=$(curl -X PATCH --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-API-Token: '$APP_CENTER_KEY -d '{ "status": "committed"  }' 'https://api.appcenter.ms/v0.1/apps/palawan-appcenter/Employee-Mobile-IOS/release_uploads/'$upload_id)
release_url=`echo $release_data | jq -r '.release_url'`

echo `Release url: $release_url`

echo "Distributing the release"

release_success=$(curl -X PATCH --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-API-Token: '$APP_CENTER_KEY -d '{ "destination_name": "Collaborators", "release_notes": "New Release" }' 'https://api.appcenter.ms/'$release_url)

echo "Distribution success"