FROM alpine:3.11

# Installs latest Chromium (89) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn


# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v6.0.0 works with Chromium 89.
# Puppeteer v3.0.0 works with Chromium 81.
RUN yarn add puppeteer@3.0.4

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

RUN apk add --update    \
	  nodejs            \
	  npm

WORKDIR /app

ADD . /app

RUN chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

RUN npm install
RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]