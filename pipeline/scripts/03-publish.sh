#!/bin/bash

set -euo pipefail

version=$1
npm_username=$2
npm_email=$3
npm_password=$4

script_dir=$(dirname "$(pwd)/$0")

pushd "$script_dir" > /dev/null

echo "Bumping to $version...\n\n"

git config --global user.email "jenkins@mapify.ai"
git config --global user.name "Jenkins"

git tag -a $version -m "Version $version"
git push origin "$version"

echo "Tag $version pushed\n\n"

docker run "js-sdk:$1" --tty sh -c \
"yarn build && 
cp package.json *.md dist && 
cp -r dist /deploy &&
cd /deploy &&
{ echo \"$npm_username\"; sleep 1; echo \"$npm_email\"; } | yarn login &&
echo '$npm_password' | yarn publish --access public --new-version \"$1\""

popd > /dev/null