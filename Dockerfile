FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# The GitHub connector stores the large game source as a compressed text bundle.
# Restore the exact runtime game.js while building the image.
RUN cat /usr/share/nginx/html/game-bundle/*.b64 \
      | base64 -d \
      | gzip -dc > /usr/share/nginx/html/game.js \
    && rm -rf /usr/share/nginx/html/game-bundle /usr/share/nginx/html/game-src

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1
