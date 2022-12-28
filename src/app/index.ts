import { orderBy } from "lodash";
import * as uuid from "uuid";

import { Cross, Distance, findClosestPointOnLine, Line, Point, Polygon, polygonContainsPoint, Token } from "./geometry";
import { RenderArea, Scale } from "./rendering";
import { crossWidth } from "./rendering/cross";
import { tokenRadius } from "./rendering/token";
import { Tool, ToolContext, allToolTypes, panTool } from "./tools";

export class AppState {
  private readonly allPages: ReadonlyArray<Page>;
  private readonly deletedPageIds: Set<string>;
  public readonly updates: ReadonlyArray<AppUpdate>;

  public constructor(
    allPages: ReadonlyArray<Page>,
    deletedPageIds: Set<string>,
    updates: ReadonlyArray<AppUpdate>,
  ) {
    this.allPages = allPages;
    this.deletedPageIds = deletedPageIds;
    this.updates = updates;
  }

  public get pages(): ReadonlyArray<Page> {
    return this.allPages.filter(page => !this.deletedPageIds.has(page.id));
  }

  public findPage(id: string): Page | null {
    return this.pages.find(page => page.id === id) ?? null;
  }

  public addPage(id: string): AppState {
    const page = Page.createEmpty(id, `Page #${this.allPages.length + 1}`);
    return new AppState(
      [...this.allPages, page],
      this.deletedPageIds,
      this.updates,
    );
  }

  public updatePage(id: string, func: (page: Page) => Page): AppState {
    return new AppState(
      this.allPages.map(page => page.id === id ? func(page) : page),
      this.deletedPageIds,
      this.updates,
    );
  }

  public deletePage(id: string): AppState {
    const deletedPageIds = new Set(this.deletedPageIds);
    deletedPageIds.add(id);

    return new AppState(
      this.allPages,
      deletedPageIds,
      this.updates,
    );
  }

  public undeletePage(id: string): AppState {
    const deletedPageIds = new Set(this.deletedPageIds);
    deletedPageIds.delete(id);

    return new AppState(
      this.allPages,
      deletedPageIds,
      this.updates,
    );
  }

  public appendUpdate(update: AppUpdate): AppState {
    return new AppState(
      this.allPages,
      this.deletedPageIds,
      [...this.updates, update],
    );
  }
}

export function initialAppState(): AppState {
  return new AppState(
    [],
    new Set(),
    [],
  ).addPage("initial");
}

export type AppUpdate =
  | {type: "addPage", updateId: string, pageId: string}
  | {type: "deletePage", updateId: string, pageId: string}
  | {type: "undeletePage", updateId: string, pageId: string}
  | {type: "renamePage", updateId: string, pageId: string, previousName: string, name: string}
  | {type: "setPageDimensions", updateId: string, pageId: string, previousDimensions: PageDimensions, dimensions: PageDimensions}
  | {type: "addObject", updateId: string, pageId: string, object: MapObject}
  | {type: "deleteObject", updateId: string, pageId: string, objectId: string}
  | {type: "undeleteObject", updateId: string, pageId: string, objectId: string}
  | {type: "setObjectColor", updateId: string, pageId: string, objectId: string, previousColor: string, color: string}
  | {type: "moveToken", updateId: string, pageId: string, objectId: string, previousCenter: Point, center: Point}
  | {type: "setTokenText", updateId: string, pageId: string, objectId: string, previousText: string, text: string};

export const updates = {
  addPage(): AppUpdate {
    return {
      type: "addPage",
      updateId: generateUpdateId(),
      pageId: uuid.v4(),
    };
  },

  deletePage({pageId}: {pageId: string}): AppUpdate {
    return {
      type: "deletePage",
      updateId: generateUpdateId(),
      pageId,
    };
  },

  undeletePage({pageId}: {pageId: string}): AppUpdate {
    return {
      type: "undeletePage",
      updateId: generateUpdateId(),
      pageId,
    };
  },

  renamePage({pageId, previousName, name}: {pageId: string, previousName: string, name: string}): AppUpdate {
    return {
      type: "renamePage",
      updateId: generateUpdateId(),
      pageId,
      previousName,
      name,
    };
  },

  setPageDimensions({pageId, previousDimensions, dimensions}: {pageId: string, previousDimensions: PageDimensions, dimensions: PageDimensions}): AppUpdate {
    return {
      type: "setPageDimensions",
      updateId: generateUpdateId(),
      pageId,
      previousDimensions,
      dimensions,
    };
  },

  addObject({pageId, object}: {pageId: string, object: MapObject}): AppUpdate {
    return {
      type: "addObject",
      updateId: generateUpdateId(),
      pageId,
      object,
    };
  },

  deleteObject({pageId, objectId}: {pageId: string, objectId: string}): AppUpdate {
    return {
      type: "deleteObject",
      updateId: generateUpdateId(),
      pageId,
      objectId,
    };
  },

  undeleteObject({pageId, objectId}: {pageId: string, objectId: string}): AppUpdate {
    return {
      type: "undeleteObject",
      updateId: generateUpdateId(),
      pageId,
      objectId,
    };
  },

  setObjectColor({pageId, objectId, previousColor, color}: {pageId: string, objectId: string, previousColor: string, color: string}): AppUpdate {
    return {
      type: "setObjectColor",
      updateId: generateUpdateId(),
      pageId,
      objectId,
      previousColor,
      color,
    };
  },

  moveToken({pageId, objectId, previousCenter, center}: {pageId: string, objectId: string, previousCenter: Point, center: Point}): AppUpdate {
    return {
      type: "moveToken",
      updateId: generateUpdateId(),
      pageId,
      objectId,
      previousCenter,
      center,
    };
  },

  setTokenText({pageId, objectId, previousText, text}: {pageId: string, objectId: string, previousText: string, text: string}): AppUpdate {
    return {
      type: "setTokenText",
      updateId: generateUpdateId(),
      pageId,
      objectId,
      previousText,
      text,
    };
  },
};

function generateUpdateId(): string {
  return uuid.v4();
}

export function applyAppUpdate(state: AppState, update: AppUpdate): AppState {
  return applyAppUpdateInner(state, update).appendUpdate(update);
}

function applyAppUpdateInner(state: AppState, update: AppUpdate): AppState {
  switch (update.type) {
    case "addPage":
      return state.addPage(update.pageId);
    case "deletePage":
      return state.deletePage(update.pageId);
    case "undeletePage":
      return state.undeletePage(update.pageId);
    case "renamePage":
      return state.updatePage(
        update.pageId,
        page => page.name === update.previousName ? page.rename(update.name) : page,
      );
    case "setPageDimensions":
      return state.updatePage(
        update.pageId,
        page => page.withDimensions(update.dimensions),
      );
    case "addObject":
      return state.updatePage(
        update.pageId,
        page => page.addObject(update.object),
      );
    case "deleteObject":
      return state.updatePage(
        update.pageId,
        page => page.deleteObject(update.objectId),
      );
    case "undeleteObject":
      return state.updatePage(
        update.pageId,
        page => page.undeleteObject(update.objectId),
      );
    case "setObjectColor":
      return state.updatePage(
        update.pageId,
        page => page.setObjectColor(update.objectId, update.color),
      );
    case "moveToken":
      return state.updatePage(
        update.pageId,
        page => page.moveToken(update),
      );
    case "setTokenText":
      return state.updatePage(
        update.pageId,
        page => page.updateToken(
          update.objectId,
          token => token.text === update.previousText ? token.withText(update.text) : token,
        ),
      );
  }
}

export function createUpdateToUndo(state: AppState, update: AppUpdate): AppUpdate {
  switch (update.type) {
    case "addPage":
      return updates.deletePage({
        pageId: update.pageId,
      });
    case "deletePage":
      return updates.undeletePage({
        pageId: update.pageId,
      });
    case "undeletePage":
      return updates.deletePage({
        pageId: update.pageId,
      });
    case "renamePage":
      return updates.renamePage({
        pageId: update.pageId,
        previousName: update.name,
        name: update.previousName,
      });
    case "setPageDimensions":
      return updates.setPageDimensions({
        pageId: update.pageId,
        previousDimensions: update.dimensions,
        dimensions: update.previousDimensions,
      });
    case "addObject":
      return updates.deleteObject({
        pageId: update.pageId,
        objectId: update.object.id,
      });
    case "deleteObject":
      return updates.undeleteObject({
        pageId: update.pageId,
        objectId: update.objectId,
      });
    case "undeleteObject":
      return updates.deleteObject({
        pageId: update.pageId,
        objectId: update.objectId,
      });
    case "setObjectColor":
      return updates.setObjectColor({
        pageId: update.pageId,
        objectId: update.objectId,
        previousColor: update.color,
        color: update.previousColor,
      });
    case "moveToken":
      return updates.moveToken({
        pageId: update.pageId,
        objectId: update.objectId,
        previousCenter: update.center,
        center: update.previousCenter,
      });
    case "setTokenText":
      return updates.setTokenText({
        pageId: update.pageId,
        objectId: update.objectId,
        previousText: update.text,
        text: update.previousText,
      });
  }
}

export function createUpdateToRedo(state: AppState, update: AppUpdate): AppUpdate {
  switch (update.type) {
    case "addPage":
      return updates.undeletePage({
        pageId: update.pageId,
      });
    case "deletePage":
      return updates.deletePage({
        pageId: update.pageId,
      });
    case "undeletePage":
      return updates.undeletePage({
        pageId: update.pageId,
      });
    case "renamePage":
      return updates.renamePage({
        pageId: update.pageId,
        previousName: update.previousName,
        name: update.name,
      });
    case "setPageDimensions":
      return updates.setPageDimensions({
        pageId: update.pageId,
        previousDimensions: update.previousDimensions,
        dimensions: update.dimensions,
      });
    case "addObject":
      return updates.undeleteObject({
        pageId: update.pageId,
        objectId: update.object.id,
      });
    case "deleteObject":
      return updates.deleteObject({
        pageId: update.pageId,
        objectId: update.objectId,
      });
    case "undeleteObject":
      return updates.undeleteObject({
        pageId: update.pageId,
        objectId: update.objectId,
      });
    case "setObjectColor":
      return updates.setObjectColor({
        pageId: update.pageId,
        objectId: update.objectId,
        previousColor: update.previousColor,
        color: update.color,
      });
    case "moveToken":
      return updates.moveToken({
        pageId: update.pageId,
        objectId: update.objectId,
        previousCenter: update.previousCenter,
        center: update.center,
      });
    case "setTokenText":
      return updates.setTokenText({
        pageId: update.pageId,
        objectId: update.objectId,
        previousText: update.previousText,
        text: update.text,
      });
}
}

export class PageDimensions {
  public static from(options: {
    width: Distance,
    height: Distance,
    squareWidth: Distance,
  }) {
    return new PageDimensions(options);
  }

  public readonly width: Distance;
  public readonly height: Distance;
  public readonly squareWidth: Distance;

  private constructor({width, height, squareWidth}: {
    width: Distance,
    height: Distance,
    squareWidth: Distance,
  }) {
    this.width = width;
    this.height = height;
    this.squareWidth = squareWidth;
  }
}

const initialPageDimensions = PageDimensions.from({
  width: Distance.metres(40),
  height: Distance.metres(30),
  squareWidth: Distance.metres(2),
});

export class Page {
  public static createEmpty(id: string, name: string): Page {
    return new Page(id, name, initialPageDimensions, [], new Set());
  }

  public readonly id: string;
  public readonly name: string;
  public readonly dimensions: PageDimensions;
  private readonly allObjects: ReadonlyArray<NumberedMapObject>;
  private readonly deletedObjectIds: Set<string>;
  public readonly objects: ReadonlyArray<NumberedMapObject>;

  constructor(
    id: string,
    name: string,
    dimensions: PageDimensions,
    allObjects: ReadonlyArray<NumberedMapObject>,
    deletedObjectIds: Set<string>,
  ) {
    this.id = id;
    this.name = name;
    this.dimensions = dimensions;
    this.allObjects = allObjects;
    this.deletedObjectIds = deletedObjectIds;
    this.objects = this.allObjects.filter(object => !deletedObjectIds.has(object.id));
  }

  public addObject(object: MapObject): Page {
    const allObjects = [
      ...this.allObjects,
      {...object, objectNumber: this.allObjects.length + 1},
    ];
    return new Page(this.id, this.name, this.dimensions, allObjects, this.deletedObjectIds);
  }

  public deleteObject(id: string): Page {
    const deletedObjectIds = new Set(this.deletedObjectIds);
    deletedObjectIds.add(id);
    return new Page(this.id, this.name, this.dimensions, this.allObjects, deletedObjectIds);
  }

  public undeleteObject(id: string): Page {
    const deletedObjectIds = new Set(this.deletedObjectIds);
    deletedObjectIds.delete(id);
    return new Page(this.id, this.name, this.dimensions, this.allObjects, deletedObjectIds);
  }

  public setObjectColor(objectId: string, color: string): Page {
    const allObjects = this.allObjects.map(
      object => object.id === objectId ? {...object, shape: shapeSetColor(object.shape, color)} : object
    );

    return new Page(this.id, this.name, this.dimensions, allObjects, this.deletedObjectIds);
  }

  public hasObjectId(objectId: string): boolean {
    return this.objects.some(object => object.id === objectId);
  }

  public rename(name: string): Page {
    return new Page(this.id, name, this.dimensions, this.allObjects, this.deletedObjectIds);
  }

  public withDimensions(dimensions: PageDimensions): Page {
    return new Page(this.id, this.name, dimensions, this.allObjects, this.deletedObjectIds);
  }

  public updateToken(objectId: string, func: (token: Token) => Token): Page {
    const allObjects = this.allObjects.map(
      object => object.id === objectId && object.shape.type === "token" ? {
        ...object,
        shape: {
          type: "token" as const,
          token: func(object.shape.token)
        }
      } : object
    );

    return new Page(this.id, this.name, this.dimensions, allObjects, this.deletedObjectIds);
  }

  public moveToken(update: {objectId: string, previousCenter: Point, center: Point}): Page {
    return this.updateToken(
      update.objectId,
      token => token.center.equals(update.previousCenter) ? token.move(update.center) : token,
    );
  }
}

export interface MapObject {
  id: string;
  shape: Shape;
}

export interface NumberedMapObject extends MapObject {
  objectNumber: number;
}

export type Shape =
  | {type: "cross", cross: Cross}
  | {type: "line", line: Line}
  | {type: "polygon", polygon: Polygon}
  | {type: "token", token: Token};

export function shapeColor(shape: Shape): string | null {
  switch (shape.type) {
    case "cross":
      return shape.cross.color;
    case "line":
      return null;
    case "polygon":
      return shape.polygon.fillColor;
    case "token":
      return shape.token.color;
  }
}

function shapeSetColor(shape: Shape, color: string): Shape {
  switch (shape.type) {
    case "cross":
      return {
        type: "cross",
        cross: shape.cross.withColor(color),
      };
    case "line":
      return shape;
    case "polygon":
      return {
        type: "polygon",
        polygon: shape.polygon.withFillColor(color),
      };
    case "token":
      return {
        type: "token",
        token: shape.token.withColor(color),
      };
  }
}

export function shapeIsSelectableAt(
  shape: Shape,
  point: Point,
  {squareWidth}: {squareWidth: Distance},
): boolean {
  switch (shape.type) {
    case "cross":
      const { center } = shape.cross;
      const halfWidth = crossWidth({squareWidth}).divide(2);
      const left = center.x.subtract(halfWidth);
      const right = center.x.add(halfWidth);
      const top = center.y.subtract(halfWidth);
      const bottom = center.y.add(halfWidth);
      return (
        left.lessThanOrEqualTo(point.x) &&
        point.x.lessThanOrEqualTo(right) &&
        top.lessThanOrEqualTo(point.y) &&
        point.y.lessThanOrEqualTo(bottom)
      );
    case "line":
      const closestPoint = findClosestPointOnLine(shape.line, point);
      if (closestPoint === null) {
        return false;
      }
      return Line.from(closestPoint, point).length().lessThanOrEqualTo(squareWidth.divide(4));
    case "polygon":
      return polygonContainsPoint(shape.polygon, point);
    case "token":
      const radius = tokenRadius({squareWidth});
      return Line.from(shape.token.center, point).isShorterThanOrEqualTo(radius);
  }
}

export function objectsInRenderOrder(objects: ReadonlyArray<NumberedMapObject>): ReadonlyArray<NumberedMapObject> {
  const layerPolygon = 0;
  const layerLine = 1;
  const layerToken = 2;
  const layerCross = 3;

  return orderBy(objects, object => {
    switch (object.shape.type) {
      case "cross":
        return layerCross;
      case "line":
        return layerLine;
      case "polygon":
        return layerPolygon;
      case "token":
        return layerToken;
    }
  });
}

export { Cross, Distance, Line, Point, Polygon, Token };
export { RenderArea, Scale };
export { Tool, ToolContext, allToolTypes, panTool };

