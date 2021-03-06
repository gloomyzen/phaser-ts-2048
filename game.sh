#!/bin/bash

##Variables
if [ "${OS}" == "Windows_NT" ]; then
    OS_TYPE='windows';
    DOCKER_COMPOSE_CMD='winpty docker-compose'
    DOCKER_CMD='winpty docker'
elif [ "${OSTYPE}" == "linux-gnu" ]; then
    OS_TYPE='linux';
    DOCKER_COMPOSE_CMD='docker-compose'
    DOCKER_CMD='docker'
else
    OS_TYPE='macos';
    DOCKER_COMPOSE_CMD='docker-compose'
    DOCKER_CMD='docker'
fi
## Constants
GREEN_OUTPUT='\033[0;32m'
RED_OUTPUT='\033[0;31m'
YELLOW_OUTPUT='\033[1;33m'
CLEAR_OUTPUT='\033[0m'
## Colored output
pc() {
    RES=""
    case "$1" in
        green)
            RES="${GREEN_OUTPUT}$2${CLEAR_OUTPUT}"
            ;;

        red)
            RES="${RED_OUTPUT}$2${CLEAR_OUTPUT}"
            ;;

        yellow)
            RES="${YELLOW_OUTPUT}$2${CLEAR_OUTPUT}"
            ;;

        *)
            RES="${CLEAR_OUTPUT}$2${CLEAR_OUTPUT}"
            ;;

    esac

    printf "${RES}"
}


general_help() {
  pc "green" "--build | -b   "
  pc "none" " - build docker container \n"
  pc "green" "--run | -r     "
  pc "none" " - start current docker container \n"
  pc "green" "--down | -d    "
  pc "none" " - stop current active docker container \n"
#  pc "green" "--own | -o     "
#  pc "none" " - run your own command in container \n"
  pc "green" "--node | -n    "
  pc "none" " - run your own command in nodejs container \n"
#  pc "green" "--test | -t    "
#  pc "none" " - run tests on docker container \n"
}

case "$1" in

    --build|-b)
        eval ${DOCKER_COMPOSE_CMD} up -d --build
        ;;
    --run|-r)
        eval ${DOCKER_COMPOSE_CMD} up -d
        ;;
    --down|-d)
        eval ${DOCKER_COMPOSE_CMD} down
        ;;
    --nginx)
        eval ${DOCKER_CMD} down
        ;;
    --node|-n)
        eval ${DOCKER_CMD} exec -it node $2 $3 $4 $5 $6 $7 $8
        ;;
    --watch|-w)
      eval ${DOCKER_CMD} exec -it node npm run watch
      ;;
#    --own|-o)
#        own_commands $1 $2 $3 $4 $5 $6 $7 $8
#        ;;
#    --test|-t)
#        eval ${DOCKER_CMD} exec -it dev sh docker/do_test.sh
#        ;;

    --help|-h)
        general_help $1
        ;;

    *)
        echo $"Usage: $0 {--build[-b]|--run[-r]|--down[-d]|--own[-o]|--test[-t]} {for help: -h/-help} CMD"
        exit 1

esac