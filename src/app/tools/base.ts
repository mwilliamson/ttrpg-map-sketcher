import { AppUpdate, Distance, NumberedMapObject, Point, RenderArea } from "..";

export interface ToolContext {
  objects: ReadonlyArray<NumberedMapObject>;
  pageId: string;
  selectedColor: string;
  sendUpdate: (update: AppUpdate) => void;
  squareWidth: Distance,
}

export interface ToolType<TName extends string = string> {
  name: TName;
  create: () => Tool<TName>;
}

export interface Tool<TName extends string = string> {
  type: ToolType<TName>;
  onMouseMove: (mousePosition: Point, context: ToolContext) => Tool<TName>,
  onMouseLeave: (context: ToolContext) => Tool<TName>,
  onMouseLeftDown: (context: ToolContext) => Tool<TName>,
  onMouseLeftUp: (context: ToolContext) => Tool<TName>,
  render: (renderArea: RenderArea) => React.ReactNode,
}
