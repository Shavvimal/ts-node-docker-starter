# This stage installs our modules
FROM mhart/alpine-node:16 AS build
RUN apk --no-cache add bash g++ ca-certificates lz4-dev musl-dev cyrus-sasl-dev openssl-dev make python3
RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash
# Create app directory
RUN mkdir -p /usr/local/app
# Move to the app directory
WORKDIR /usr/local/app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build

# Then we copy over the modules from above onto another image to reduce the size
FROM mhart/alpine-node:16 AS release
## We need to install some dependencies for the node-rdkafka module
RUN apk --no-cache add bash g++ ca-certificates lz4-dev musl-dev cyrus-sasl-dev openssl-dev make python3
RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash
# Create app directory
RUN mkdir -p /usr/local/app
# Move to the app directory
WORKDIR /usr/local/app
COPY --from=build /usr/local/app/build .
COPY --from=build /usr/local/app/package.json .
RUN npm install --omit=dev

# Then we copy over the modules from above onto a `slim` image without npm
# You'd be reducing the image size by 40% (22MB from 54MB belong to npm and yarn in the Node 6.10 image e.g.)
FROM mhart/alpine-node:slim-16
COPY --from=release /usr/local/app .
RUN apk --no-cache add bash g++ ca-certificates lz4-dev musl-dev cyrus-sasl-dev openssl-dev make python3
RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash
CMD ["node", "index.js"]