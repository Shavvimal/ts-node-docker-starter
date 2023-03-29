# TypeScript Node Starter

## Cold reloading

Cold reloading is nice for local development.

```bash
npm run dev
```

By running this, npx nodemon will start our app using `npx ts-node ./src/index.ts`, watching for changes to `.ts` files from within `/src`.

## Creating production builds

Now, when we run `npm run build`, rimraf will remove our old build folder before the TypeScript compiler emits new code to `./build`.

```bash
npm run build
```

## Production startup script

In order to start the app in production, all we need to do is run the build command first, and then execute the compiled JavaScript at `build/index.js`

```bash
npm run start
```

## Docker

Alpine linux is a lighter weight version of linux and does not come with the same base libraries as other distributions (like glibc). To build the docker image, run the following command:

```bash
docker build -t producer .
```

To run the docker image, run the following command:

```bash
docker run -i --env-file .env --name producer producer
```
