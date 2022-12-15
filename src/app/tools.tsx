import * as uuid from "uuid";

import { AppUpdate } from ".";
import { draftColor } from "./colors";
import { Distance, Line, Point } from "./geometry";
import { RenderArea } from "./rendering";

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
}

export const noneToolType: ToolType<"None"> = {
  name: "None",
  create: () => noneTool,
};

export const noneTool: Tool<"None"> = {
  type: noneToolType,
  onMouseMove: () => noneTool,
  onMouseLeave: () => noneTool,
  onMouseLeftDown: () => noneTool,
  onMouseLeftUp: () => noneTool,
  render: () => null,
}

export type NoneTool = typeof noneTool;

export const lineToolType: ToolType<"Line"> = {
  name: "Line",
  create: (context) => new LineTool({
    lineStart: null,
    snapPoint: null,
  }, context),
}

interface LineToolState {
  lineStart: Point | null;
  snapPoint: Point | null;
}

class LineTool implements Tool<"Line"> {
  public readonly type = lineToolType;
  private readonly state: LineToolState;
  private readonly context: ToolContext;

  public constructor(state: LineToolState, context: ToolContext) {
    this.state = state;
    this.context = context;
  }

  public onMouseMove(mousePosition: Point): LineTool {
    const snapDistance = this.context.squareWidth;
    return new LineTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    }, this.context);
  }

  public onMouseLeave(): LineTool {
    return new LineTool({
      ...this.state,
      snapPoint: null,
    }, this.context);
  }

  public onMouseLeftDown(): LineTool {
    return new LineTool({
      ...this.state,
      lineStart: this.state.snapPoint,
    }, this.context);
  }

  public onMouseLeftUp(): LineTool {
    const { lineStart, snapPoint } = this.state;
    if (lineStart !== null && snapPoint !== null && !lineStart.equals(snapPoint)) {
      const id = uuid.v4();
      const line = Line.from(lineStart, snapPoint);
      this.context.sendUpdate({type: "addLine", objectId: id, line});
    }
    return new LineTool({
      ...this.state,
      lineStart: null,
    }, this.context);
  }

  public render(renderArea: RenderArea) {
    const { lineStart, snapPoint } = this.state;

    return (
      <g>
        {snapPoint !== null && (
          <circle cx={renderArea.toPixels(snapPoint.x)} cy={renderArea.toPixels(snapPoint.y)} r={5} fill={draftColor} />
        )}
        {lineStart !== null && (
          <circle cx={renderArea.toPixels(lineStart.x)} cy={renderArea.toPixels(lineStart.y)} r={5} fill={draftColor} />
        )}
        {lineStart !== null && snapPoint !== null && (
          <line
            x1={renderArea.toPixels(lineStart.x)}
            y1={renderArea.toPixels(lineStart.y)}
            x2={renderArea.toPixels(snapPoint.x)}
            y2={renderArea.toPixels(snapPoint.y)}
            stroke={draftColor}
          />
        )}
      </g>
    );
  }
}

export const allToolTypes: ReadonlyArray<ToolType<string>> = [noneToolType, lineToolType];

