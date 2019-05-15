#!/bin/bash

set -euo pipefail

version=$1

script_dir=$(dirname "$(pwd)/$0")

pushd "$script_dir" > /dev/null

docker run "js-sdk:$1" sh -c "yarn test"

popd > /dev/null