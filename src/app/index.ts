import * as uuid from "uuid";

import { Cross, Distance, Line, Point, Polygon, Token } from "./geometry";
import { RenderArea, Scale } from "./rendering";
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
  | {type: "addObject", updateId: string, pageId: string, object: MapObject}
  | {type: "deleteObject", updateId: string, pageId: string, objectId: string}
  | {type: "undeleteObject", updateId: string, pageId: string, objectId: string}
  | {type: "moveToken", updateId: string, pageId: string, objectId: string, previousCenter: Point, center: Point};

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
    }
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

  moveToken({pageId, objectId, previousCenter, center}: {pageId: string, objectId: string, previousCenter: Point, center: Point}): AppUpdate {
    return {
      type: "moveToken",
      updateId: generateUpdateId(),
      pageId,
      objectId,
      previousCenter,
      center,
    }
  },
}

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
      )
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
    case "moveToken":
      return state.updatePage(
        update.pageId,
        page => page.moveToken(update),
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
    case "moveToken":
      return updates.moveToken({
        pageId: update.pageId,
        objectId: update.objectId,
        previousCenter: update.previousCenter,
        center: update.center,
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
    case "moveToken":
      return updates.moveToken({
        pageId: update.pageId,
        objectId: update.objectId,
        previousCenter: update.previousCenter,
        center: update.center,
      });
  }
}

export class PageDimensions {
  public static from(options: {
    scale: Scale,
    width: Distance,
    height: Distance,
    squareWidth: Distance,
  }) {
    return new PageDimensions(options);
  }

  public readonly scale: Scale;
  public readonly width: Distance;
  public readonly height: Distance;
  public readonly squareWidth: Distance;

  private constructor({scale, width, height, squareWidth}: {
    scale: Scale,
    width: Distance,
    height: Distance,
    squareWidth: Distance,
  }) {
    this.scale = scale;
    this.width = width;
    this.height = height;
    this.squareWidth = squareWidth;
  }
}

export class Page {
  public static createEmpty(id: string, name: string): Page {
    return new Page(id, name, [], new Set());
  }

  public readonly id: string;
  public readonly name: string;
  private readonly allObjects: ReadonlyArray<NumberedMapObject>;
  private readonly deletedObjectIds: Set<string>;
  public readonly objects: ReadonlyArray<NumberedMapObject>;

  constructor(
    id: string,
    name: string,
    allObjects: ReadonlyArray<NumberedMapObject>,
    deletedObjectIds: Set<string>,
  ) {
    this.id = id;
    this.name = name;
    this.allObjects = allObjects;
    this.deletedObjectIds = deletedObjectIds;
    this.objects = this.allObjects.filter(object => !deletedObjectIds.has(object.id))
  }

  public addObject(object: MapObject): Page {
    const allObjects = [
      ...this.allObjects,
      {...object, objectNumber: this.allObjects.length + 1},
    ]
    return new Page(this.id, this.name, allObjects, this.deletedObjectIds);
  }

  public deleteObject(id: string): Page {
    const deletedObjectIds = new Set(this.deletedObjectIds);
    deletedObjectIds.add(id);
    return new Page(this.id, this.name, this.allObjects, deletedObjectIds);
  }

  public undeleteObject(id: string): Page {
    const deletedObjectIds = new Set(this.deletedObjectIds);
    deletedObjectIds.delete(id);
    return new Page(this.id, this.name, this.allObjects, deletedObjectIds);
  }

  public rename(name: string): Page {
    return new Page(this.id, name, this.allObjects, this.deletedObjectIds);
  }

  public moveToken(update: {objectId: string, previousCenter: Point, center: Point}): Page {
    const allObjects = this.allObjects.map(
      object => object.id === update.objectId && object.shape.type === "token" && object.shape.token.center.equals(update.previousCenter) ? {
        ...object,
        shape: {
          type: "token" as const,
          token: object.shape.token.move(update.center)
        }
      } : object
    );

    return new Page(this.id, this.name, allObjects, this.deletedObjectIds);
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

export { Cross, Distance, Line, Point, Polygon, Token };
export { RenderArea, Scale };
export { Tool, ToolContext, allToolTypes, panTool };

