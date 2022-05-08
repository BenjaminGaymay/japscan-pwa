#!/bin/bash

# ? docker run -it --rm --privileged tonistiigi/binfmt --install all

docker run -it --rm --privileged tonistiigi/binfmt --install all
docker buildx build --platform linux/arm64,linux/amd64 -t registry.benjamin-gaymay.eu/mangas --push .

ssh -t pi4-mangas "./restart.sh"
