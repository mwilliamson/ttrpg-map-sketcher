import { AppUpdate, Cross, Distance, Line, MapObject, Point, Polygon, Shape, Token } from "./app";
import assertNever from "./util/assertNever";

type SerializedAppUpdate =
  | {type: "addPage", pageId: string}
  | {type: "deletePage", pageId: string}
  | {type: "undeletePage", pageId: string}
  | {type: "addObject", pageId: string, object: SerializedMapObject}
  | {type: "deleteObject", pageId: string, objectId: string};

interface SerializedMapObject {
  id: string;
  shape: SerializedShape;
}

type SerializedShape =
  | {type: "cross", cross: SerializedCross}
  | {type: "line", line: SerializedLine}
  | {type: "polygon", polygon: SerializedPolygon}
  | {type: "token", token: SerializedToken};

interface SerializedCross {
  center: SerializedPoint;
  color: string;
}

interface SerializedLine {
  start: SerializedPoint;
  end: SerializedPoint;
}

interface SerializedPolygon {
  points: ReadonlyArray<SerializedPoint>;
  fillColor: string;
}

interface SerializedToken {
  center: SerializedPoint;
  color: string;
}

interface SerializedPoint {
  x: SerializedDistance;
  y: SerializedDistance;
}

type SerializedDistance = number;

export function serializeAppUpdate(update: AppUpdate): SerializedAppUpdate {
  switch (update.type) {
    case "addPage":
      return update;
    case "deletePage":
      return update;
    case "undeletePage":
      return update;
    case "addObject":
      return {
        type: "addObject",
        pageId: update.pageId,
        object: serializeMapObject(update.object),
      }
    case "deleteObject":
      return update;
  }
}

export function deserializeAppUpdate(untypedUpdate: unknown): AppUpdate {
  const update = untypedUpdate as SerializedAppUpdate;
  switch (update.type) {
    case "addPage":
      return update;
    case "deletePage":
      return update;
    case "undeletePage":
      return update;
    case "addObject":
      return {
        type: "addObject",
        pageId: update.pageId,
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
    case "token":
      return {
        type: "token",
        token: serializeToken(shape.token),
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
      case "token":
        return {
          type: "token",
          token: deserializeToken(shape.token),
        };
    default:
      return assertNever(shape, "unhandled shape type");
  }
}

function serializeCross(cross: Cross): SerializedCross {
  return {
    center: serializePoint(cross.center),
    color: cross.color,
  };
}

function deserializeCross(cross: SerializedCross): Cross {
  return Cross.from(
    deserializePoint(cross.center),
    cross.color,
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
    fillColor: polygon.fillColor,
  };
}

function deserializePolygon(polygon: SerializedPolygon): Polygon {
  return Polygon.from(
    polygon.points.map(point => deserializePoint(point)),
    polygon.fillColor,
  );
}

function serializeToken(token: Token): SerializedToken {
  return {
    center: serializePoint(token.center),
    color: token.color,
  };
}

function deserializeToken(token: SerializedToken): Token {
  return Token.from(
    deserializePoint(token.center),
    token.color,
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
