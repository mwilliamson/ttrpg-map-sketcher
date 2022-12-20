import { findLast } from "lodash";

import { Cross, Distance, Line, Point, Polygon, Token } from "./geometry";
import { RenderArea, Scale } from "./rendering";
import { Tool, ToolContext, allToolTypes, noneTool } from "./tools";

export interface AppState {
  pages: ReadonlyArray<Page>;
  updates: ReadonlyArray<AppUpdate>;
};

export function initialAppState(): AppState {
  return {
    pages: [Page.createEmpty("initial")],
    updates: [],
  };
}

export type AppUpdate =
  | {type: "addObject", pageId: string, object: MapObject}
  | {type: "deleteObject", pageId: string, id: string};

export function applyAppUpdate(state: AppState, update: AppUpdate): AppState {
  return {
    ...applyAppUpdateInner(state, update),
    updates: [...state.updates, update],
  };
}

function applyAppUpdateInner(state: AppState, update: AppUpdate): AppState {
  switch (update.type) {
    case "addObject":
      return {
        ...state,
        pages: state.pages.map(page => page.id === update.pageId ? page.addObject(update.object) : page)
      };
    case "deleteObject":
      return {
        ...state,
        pages: state.pages.map(page => page.id === update.pageId ? page.deleteObject(update.id) : page)
      };
  }
}

export function createUpdateToUndo(state: AppState, update: AppUpdate): AppUpdate | null {
  switch (update.type) {
    case "addObject":
      return {
        type: "deleteObject",
        pageId: update.pageId,
        id: update.object.id,
      };
    case "deleteObject":
      return findLast(
        state.updates,
        updateAdd => updateAdd.type === "addObject" && updateAdd.object.id === update.id,
      ) || null;
  }
}

export class Page {
  public static createEmpty(id: string): Page {
    return new Page(id, [], 1);
  }

  public readonly id: string;
  public readonly objects: ReadonlyArray<SeededMapObject>;
  public readonly nextSeed: number;

  constructor(id: string, objects: ReadonlyArray<SeededMapObject>, nextSeed: number) {
    this.id = id;
    this.objects = objects;
    this.nextSeed = nextSeed;
  }

  public addObject(object: MapObject): Page {
    const objects = [
      ...this.objects,
      {...object, seed: this.nextSeed},
    ]
    return new Page(this.id, objects, this.nextSeed + 1);
  }

  public deleteObject(id: string): Page {
    const objects = this.objects.filter(object => object.id !== id);
    return new Page(this.id, objects, this.nextSeed);
  }
}

export interface MapObject {
  id: string;
  shape: Shape;
}

export interface SeededMapObject extends MapObject {
  seed: number;
}

export type Shape =
  | {type: "cross", cross: Cross}
  | {type: "line", line: Line}
  | {type: "polygon", polygon: Polygon}
  | {type: "token", token: Token};

export { Cross, Distance, Line, Point, Polygon, Token };
export { RenderArea, Scale };
export { Tool, ToolContext, allToolTypes, noneTool };
