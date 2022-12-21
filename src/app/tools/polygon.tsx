import * as uuid from "uuid";
import { updates } from "..";

import { Polygon, Point } from "../geometry";
import { RenderArea } from "../rendering";
import { PolygonDraftView } from "../rendering/polygon";
import { Tool, ToolContext, ToolType } from "./base";

export const polygonToolType: ToolType<"Polygon"> = {
  name: "Polygon",
  create: () => new PolygonTool({
    points: [],
    snapPoint: null,
  }),
}

interface PolygonToolState {
  points: ReadonlyArray<Point>;
  snapPoint: Point | null;
}

class PolygonTool implements Tool<"Polygon"> {
  public readonly type = polygonToolType;
  private readonly state: PolygonToolState;

  public constructor(state: PolygonToolState) {
    this.state = state;
  }

  public onMouseMove(mousePosition: Point, context: ToolContext): PolygonTool {
    const snapDistance = context.squareWidth;
    return new PolygonTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    });
  }

  public onMouseLeave(): PolygonTool {
    return new PolygonTool({
      ...this.state,
      snapPoint: null,
    });
  }

  public onMouseLeftDown(context: ToolContext): PolygonTool {
    if (this.state.snapPoint === null) {
      return this;
    } else if (this.state.points.length > 0 && this.state.snapPoint.equals(this.state.points[0])) {
        const id = uuid.v4();
        const polygon = Polygon.from(this.state.points, context.selectedColor);
        const shape = {type: "polygon" as const, polygon};
        const object = {id, shape};
        context.sendUpdate(updates.addObject({pageId: context.pageId, object}));

        return new PolygonTool({
          ...this.state,
          points: [],
        });
    } else {
      return new PolygonTool({
          ...this.state,
          points: [...this.state.points, this.state.snapPoint],
        });
    }
  }

  public onMouseLeftUp(): PolygonTool {
    return this;
  }

  public render(renderArea: RenderArea) {
    const { points, snapPoint } = this.state;

    const allPoints = snapPoint === null ? points : [...points, snapPoint];

    return (
      <PolygonDraftView
        points={allPoints}
        renderArea={renderArea}
      />
    );
  }
}
