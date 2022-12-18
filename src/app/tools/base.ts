import { AppUpdate, Distance, Point, RenderArea } from "..";

export interface ToolContext {
  sendUpdate: (update: AppUpdate) => void;
  squareWidth: Distance,
}

export interface ToolType<TName extends string> {
  name: TName;
  create: (context: ToolContext) => Tool<TName>;
}

export interface Tool<TName extends string = string> {
  type: ToolType<TName>;
  onMouseMove: (mousePosition: Point) => Tool<TName>,
  onMouseLeave: () => Tool<TName>,
  onMouseLeftDown: () => Tool<TName>,
  onMouseLeftUp: () => Tool<TName>,
  render: (renderArea: RenderArea) => React.ReactNode,
  withContext: (context: ToolContext) => Tool<TName>,
}
