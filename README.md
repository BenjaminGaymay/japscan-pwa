# Japscan PWA

A Progressive Web App to read scan from the japscan website. This can be installed as an application on a mobile device.

The app needs to be run with Docker to ensure the compatibility between puppeteer and the chromium version.

## Build Setup

```bash
# build docker image
$ docker build -t japscan .

# start server
$ docker run -p 3333:3333 japscan
```

The app is available by default on [localhost:3333](http://localhost:3333/)
