#!/bin/bash

DIR=`dirname "$0"`

USAGE="Usage: buildInternalDependencies.sh [--watch] [--withTypes]"

watch=false
with_types=false
while [ "$1" != "" ]; do
  case $1 in
      --watch)
        shift
        watch=true
        ;;
      --withTypes)
        shift
        with_types=true
        shift
        ;;
      -h | --help )
        echo -e "$USAGE\n";
        exit
        ;;
      * )
        echo -e "$USAGE\n"
        exit 1
  esac
done

[[ $watch = "true" ]] && build_args="--watch" || build_args=""
[[ $watch = "true" ]] && build_ts_args="--watch" || build_ts_args=""

# ui-components building is quite resource intensive, so we avoid parallelising
PACKAGES_FOR_SERIAL_BUILD=("ui-components")

concurrent_build_commands=()
serial_build_commands=()

# Build dependencies
for PACKAGE in $(${DIR}/getInternalDependencies.sh); do
  build_command="yarn workspace @tupaia/${PACKAGE} build $build_args"
  if [[ " ${PACKAGES_FOR_SERIAL_BUILD[@]} " =~ " ${PACKAGE} " ]]; then
    serial_build_commands+=("${build_command}")
  else
    concurrent_build_commands+=("\"${build_command}\"")
  fi
done

# Build types
if [ $with_types == "true" ]; then
  for PACKAGE in $(${DIR}/getTypedInternalDependencies.sh); do
    concurrent_build_commands+=("\"yarn workspace @tupaia/${PACKAGE} build:ts $build_ts_args\"")
  done
fi

echo "Concurrently building internal dependencies"
echo "yarn concurrently ${concurrent_build_commands[@]}"
eval "yarn concurrently ${concurrent_build_commands[@]}"

echo "Serially building resource intensive internal dependencies"
for build_command in "${serial_build_commands[@]}"; do
  echo ${build_command}
  ${build_command}
done

