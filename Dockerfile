FROM node:16-alpine as version

WORKDIR /scans

COPY --chown=node:node package.json package-lock.json ./

RUN node -e "['./package.json','./package-lock.json'].forEach(n => {  \
  let p = require(n);                               \
  p.version = '0.0.0';                              \
  fs.writeFileSync(n, JSON.stringify(p));           \
  });"


FROM node:16-alpine as build

WORKDIR /scans

RUN apk add \
  --no-cache \
  --virtual build-dependencies \
  python3 \
  chromium \
  make \
  g++ \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


COPY --chown=node:node --from=version /scans/package.json /scans/package-lock.json ./
RUN npm ci --only=production
RUN npm cache clean --force

COPY --chown=node:node . .

RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=8080

USER node

EXPOSE 8080
EXPOSE 8000

CMD [ "npm", "start" ]


# FROM node:16 as version

# WORKDIR /mangas

# COPY --chown=node:node package.json package-lock.json ./

# RUN node -e "['./package.json','./package-lock.json'].forEach(n => {  \
#   let p = require(n);                               \
#   p.version = '0.0.0';                              \
#   fs.writeFileSync(n, JSON.stringify(p));           \
#   });"


# FROM node:16 as build

# WORKDIR /mangas

# RUN apt update
# RUN apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libasound2 libpangocairo-1.0-0 libxss1 libgtk-3-0 libx11-xcb1 chromium

# RUN ln -s /usr/bin/chromium /usr/bin/chromium-browser

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# COPY --chown=node:node --from=version /mangas/package.json /mangas/package-lock.json ./
# RUN npm ci --only=production
# RUN npm cache clean --force

# COPY --chown=node:node . .

# RUN npm run build

# ENV NUXT_HOST=0.0.0.0
# ENV NUXT_PORT=8080

# USER node

# EXPOSE 8080
# EXPOSE 8000

# CMD [ "npm", "start" ]
