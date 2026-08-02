# syntax=docker/dockerfile:1
# Dev-only image — NOT a production artifact. Vercel builds its own runtime from
# `astro build`; a prod Dockerfile here would be dead code. Debian slim to match
# the app repo's base. Nothing is COPYed but the entrypoint: source is
# bind-mounted at run time and node_modules is container-owned (see compose.yaml).
FROM node:24-bookworm-slim

WORKDIR /site

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 4321
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
