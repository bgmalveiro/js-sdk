#!/bin/bash

set -euo pipefail

version=$1

script_dir=$(dirname "$(pwd)/$0")

pushd "$script_dir" > /dev/null

cd ../../
docker build . -t "js-sdk:$version"

popd > /dev/null