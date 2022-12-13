import { AppUpdate, Distance, Line, LineObject, Point } from "./app";

type SerializedAppUpdate =
  | {type: "setDimensions", widthMetres: number, heightMetres: number}
  | {type: "addLine", lineObject: SerializedLineObject};

interface SerializedLineObject {
  id: string;
  line: SerializedLine;
}

interface SerializedLine {
  start: SerializedPoint;
  end: SerializedPoint;
}

interface SerializedPoint {
  x: SerializedDistance;
  y: SerializedDistance;
}

type SerializedDistance = number;

export function serializeAppUpdate(update: AppUpdate): SerializedAppUpdate {
  switch (update.type) {
    case "setDimensions":
      return update;
    case "addLine":
      return {
        type: "addLine",
        lineObject: serializeLineObject(update.lineObject),
      }
  }
}

export function deserializeAppUpdate(untypedUpdate: unknown): AppUpdate {
  const update = untypedUpdate as SerializedAppUpdate;
  switch (update.type) {
    case "setDimensions":
      return update;
    case "addLine":
      return {
        "type": "addLine",
        lineObject: deserializeLineObject(update.lineObject),
      };
  }
}

function serializeLineObject(lineObject: LineObject): SerializedLineObject {
  return {
    id: lineObject.id,
    line: serializeLine(lineObject.line),
  };
}

function deserializeLineObject(lineObject: SerializedLineObject): LineObject {
  return {
    id: lineObject.id,
    line: deserializeLine(lineObject.line),
  };
}

function serializeLine(line: Line): SerializedLine {
  return {
    start: serializePoint(line.start),
    end: serializePoint(line.end),
  };
}

function deserializeLine(line: SerializedLine): Line {
  return Line.from(
    deserializePoint(line.start),
    deserializePoint(line.end),
  );
}

function serializePoint(point: Point): SerializedPoint {
  return {
    x: serializeDistance(point.x),
    y: serializeDistance(point.y),
  }
}

function deserializePoint(point: SerializedPoint): Point {
  return Point.from(
    deserializeDistance(point.x),
    deserializeDistance(point.y),
  );
}

function serializeDistance(distance: Distance): SerializedDistance {
  return distance.toMetres();
}

function deserializeDistance(distance: SerializedDistance): Distance {
  return Distance.metres(distance);
}
