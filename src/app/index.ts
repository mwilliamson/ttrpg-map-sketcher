import { findLast } from "lodash";

import { Cross, Distance, Line, Point, Polygon, Token } from "./geometry";
import { RenderArea, Scale } from "./rendering";
import { Tool, ToolContext, allToolTypes, noneTool } from "./tools";

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
  | {type: "addPage", id: string}
  | {type: "deletePage", id: string}
  | {type: "undeletePage", id: string}
  | {type: "addObject", pageId: string, object: MapObject}
  | {type: "deleteObject", pageId: string, id: string};

export function applyAppUpdate(state: AppState, update: AppUpdate): AppState {
  return applyAppUpdateInner(state, update).appendUpdate(update);
}

function applyAppUpdateInner(state: AppState, update: AppUpdate): AppState {
  switch (update.type) {
    case "addPage":
      return state.addPage(update.id);
    case "deletePage":
      return state.deletePage(update.id);
    case "undeletePage":
      return state.undeletePage(update.id);
    case "addObject":
      return state.updatePage(
        update.pageId,
        page => page.addObject(update.object),
      );
    case "deleteObject":
      return state.updatePage(
        update.pageId,
        page => page.deleteObject(update.id),
      );
  }
}

export function createUpdateToUndo(state: AppState, update: AppUpdate): AppUpdate | null {
  switch (update.type) {
    case "addPage":
      return {
        type: "deletePage",
        id: update.id,
      };
    case "deletePage":
      return {
        type: "undeletePage",
        id: update.id,
      };
    case "undeletePage":
      return {
        type: "deletePage",
        id: update.id,
      };
    case "addObject":
      return {
        type: "deleteObject",
        pageId: update.pageId,
        id: update.object.id,
      };
    case "deleteObject":
      // TODO: switch deletion to being a flag, especially once objects can be edited
      return findLast(
        state.updates,
        updateAdd => updateAdd.type === "addObject" && updateAdd.object.id === update.id,
      ) || null;
  }
}

export function createUpdateToRedo(state: AppState, update: AppUpdate): AppUpdate {
  switch (update.type) {
    case "addPage":
      return {
        type: "undeletePage",
        id: update.id,
      };
    case "deletePage":
      return update;
    case "undeletePage":
      return update;
    case "addObject":
      return update;
    case "deleteObject":
      return update;
  }
}

export class Page {
  public static createEmpty(id: string, name: string): Page {
    return new Page(id, name, [], 1);
  }

  public readonly id: string;
  public readonly name: string;
  public readonly objects: ReadonlyArray<NumberedMapObject>;
  public readonly nextObjectNumber: number;

  constructor(
    id: string,
    name: string,
    objects: ReadonlyArray<NumberedMapObject>,
    nextObjectNumber: number,
  ) {
    this.id = id;
    this.name = name;
    this.objects = objects;
    this.nextObjectNumber = nextObjectNumber;
  }

  public addObject(object: MapObject): Page {
    const objects = [
      ...this.objects,
      {...object, objectNumber: this.nextObjectNumber},
    ]
    return new Page(this.id, this.name, objects, this.nextObjectNumber + 1);
  }

  public deleteObject(id: string): Page {
    const objects = this.objects.filter(object => object.id !== id);
    return new Page(this.id, this.name, objects, this.nextObjectNumber);
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
export { Tool, ToolContext, allToolTypes, noneTool };
