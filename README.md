# TTRPG Map Sketcher

[Live demo](https://mwilliamson.github.io/ttrpg-map-sketcher/)

Note that the live demo stores the entire state of the map in memory.
See below for instructions on running a server to support persistence and collaboration.

## Usage

Pan around the map by dragging with the right mouse button.

Zoom in and out using the scroll wheel on the map.

Tools:

* Pan: Pan around the map by dragging with the left mouse button.

* Select: Left click to select an object on the map.
  If there is more than one object at the same location,
  click multiple times to cycle through the objects.
  To deselect an object, press Escape or left click an area of the map without any objects.
  Press Delete or Backspace to delete a selected object.

  Regardless of which tool is currently selected,
  holding down Ctrl will temporarily set the active tool to the Select tool.

* Line: Draw a line on the map.
  Left click once to start the line,
  left click again to end the line.
  Press Escape to cancel a line in progress.

* Polygon: Draw a polygon on the map.
  Left click to indicate the corners of the polygon.
  Click on the starting corner to finish the polygon.
  Press Escape to cancel a polygon in progress.

* Cross: Draw a cross on the map.

* Token: Place a token  on the map.

* Move: Left click and drag a token to move it around the map.

* Ruler: Left click and drag to measure distance on the map.

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
