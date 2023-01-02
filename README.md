# TTRPG Map Sketcher

## Running the server

* Run `npm install`.
* Start the server with `npm start`.
* Run `npm run build` to build the client.

If you want to persist updates, pass an extra argument to `npm start`, for instance:

```
npm start -- example.log
```

You can also set the environment variables:

* `PORT`: the port to run the server on. Defaults to 8080.

* `WEBSOCKET_PATH`: the path the server should accept client connections on.
  If set, add `path=$PATH` to the query string.

For instance, if you ran:

```
PORT=8000 WEBSOCKET_PATH=/example npm start
```

then you should be able to open the client with the URL:

```
http://localhost:8000/?path=/example
```

## Development

During development:

* Run `npm run watch` to continuously build the client.
* Run `npm run check-watch` to continuously type-check the client.
* Run `npm run eslint` to run eslint.
