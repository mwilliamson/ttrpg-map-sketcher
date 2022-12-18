import { AppUpdate, Distance, Line, MapObject, Point, Polygon, Shape } from "./app";
import { Cross } from "./app/geometry";
import assertNever from "./assertNever";

type SerializedAppUpdate =
  | {type: "addObject", object: SerializedMapObject}
  | {type: "deleteObject", id: string};

interface SerializedMapObject {
  id: string;
  shape: SerializedShape;
}

type SerializedShape =
  | {type: "cross", cross: SerializedCross}
  | {type: "line", line: SerializedLine}
  | {type: "polygon", polygon: SerializedPolygon};


interface SerializedCross {
  center: SerializedPoint;
}

interface SerializedLine {
  start: SerializedPoint;
  end: SerializedPoint;
}

interface SerializedPolygon {
  points: ReadonlyArray<SerializedPoint>;
}

interface SerializedPoint {
  x: SerializedDistance;
  y: SerializedDistance;
}

type SerializedDistance = number;

export function serializeAppUpdate(update: AppUpdate): SerializedAppUpdate {
  switch (update.type) {
    case "addObject":
      return {
        type: "addObject",
        object: serializeMapObject(update.object),
      }
    case "deleteObject":
      return update;
  }
}

export function deserializeAppUpdate(untypedUpdate: unknown): AppUpdate {
  const update = untypedUpdate as SerializedAppUpdate;
  switch (update.type) {
    case "addObject":
      return {
        type: "addObject",
        object: deserializeMapObject(update.object),
      };
    case "deleteObject":
      return update;
  }
}

function serializeMapObject(object: MapObject): SerializedMapObject {
  return {
    id: object.id,
    shape: serializeShape(object.shape),
  };
}

function deserializeMapObject(object: SerializedMapObject): MapObject {
  return {
    id: object.id,
    shape: deserializeShape(object.shape),
  };
}

function serializeShape(shape: Shape): SerializedShape {
  switch (shape.type) {
    case "cross":
      return {
        type: "cross",
        cross: serializeCross(shape.cross),
      };
    case "line":
      return {
        type: "line",
        line: serializeLine(shape.line),
      };
    case "polygon":
      return {
        type: "polygon",
        polygon: serializePolygon(shape.polygon),
      };
    default:
      return assertNever(shape, "unhandled shape type");
  }
}

function deserializeShape(shape: SerializedShape): Shape {
  switch (shape.type) {
    case "cross":
      return {
        type: "cross",
        cross: deserializeCross(shape.cross),
      };
    case "line":
      return {
        type: "line",
        line: deserializeLine(shape.line),
      };
    case "polygon":
      return {
        type: "polygon",
        polygon: deserializePolygon(shape.polygon),
      };
    default:
      return assertNever(shape, "unhandled shape type");
  }
}

function serializeCross(cross: Cross): SerializedCross {
  return {
    center: serializePoint(cross.center),
  };
}

function deserializeCross(cross: SerializedCross): Cross {
  return Cross.from(
    deserializePoint(cross.center),
  );
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

function serializePolygon(polygon: Polygon): SerializedPolygon {
  return {
    points: polygon.points.map(point => serializePoint(point)),
  };
}

function deserializePolygon(polygon: SerializedPolygon): Polygon {
  return Polygon.from(polygon.points.map(point => deserializePoint(point)));
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
