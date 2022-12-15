import { AppUpdate, Distance, Line, Point } from "./app";

type SerializedAppUpdate =
  | {type: "addLine", objectId: string, line: SerializedLine}
  | {type: "deleteObject", id: string};

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
    case "addLine":
      return {
        type: "addLine",
        objectId: update.objectId,
        line: serializeLine(update.line),
      }
    case "deleteObject":
      return update;
  }
}

export function deserializeAppUpdate(untypedUpdate: unknown): AppUpdate {
  const update = untypedUpdate as SerializedAppUpdate;
  switch (update.type) {
    case "addLine":
      return {
        "type": "addLine",
        objectId: update.objectId,
        line: deserializeLine(update.line),
      };
    case "deleteObject":
      return update;
  }
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
