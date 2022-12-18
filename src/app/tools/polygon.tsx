import * as uuid from "uuid";
import slidingPairs from "../../slidingPairs";

import { draftColor } from "../colors";
import { Polygon, Point } from "../geometry";
import { RenderArea } from "../rendering";
import { Tool, ToolContext, ToolType } from "./base";

export const polygonToolType: ToolType<"Polygon"> = {
  name: "Polygon",
  create: (context) => new PolygonTool({
    points: [],
    snapPoint: null,
  }, context),
}

interface PolygonToolState {
  points: ReadonlyArray<Point>;
  snapPoint: Point | null;
}

class PolygonTool implements Tool<"Polygon"> {
  public readonly type = polygonToolType;
  private readonly state: PolygonToolState;
  private readonly context: ToolContext;

  public constructor(state: PolygonToolState, context: ToolContext) {
    this.state = state;
    this.context = context;
  }

  public onMouseMove(mousePosition: Point): PolygonTool {
    const snapDistance = this.context.squareWidth;
    return new PolygonTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    }, this.context);
  }

  public onMouseLeave(): PolygonTool {
    return new PolygonTool({
      ...this.state,
      snapPoint: null,
    }, this.context);
  }

  public onMouseLeftDown(): PolygonTool {
    if (this.state.snapPoint === null) {
      return this;
    } else if (this.state.points.length > 0 && this.state.snapPoint.equals(this.state.points[0])) {
        const id = uuid.v4();
        const polygon = Polygon.from(this.state.points);
        const shape = {type: "polygon" as const, polygon};
        const object = {id, shape};
        this.context.sendUpdate({type: "addObject", object});

        return new PolygonTool({
          ...this.state,
          points: [],
        }, this.context);
    } else {
      return new PolygonTool({
          ...this.state,
          points: [...this.state.points, this.state.snapPoint],
        }, this.context);
    }
  }

  public onMouseLeftUp(): PolygonTool {
    return this;
  }

  public render(renderArea: RenderArea) {
    const { points, snapPoint } = this.state;

    const allPoints = snapPoint === null ? points : [...points, snapPoint];

    return (
      <g>
        {allPoints.map((point, pointIndex) => (
          <circle
            key={pointIndex}
            cx={renderArea.toPixels(point.x)}
            cy={renderArea.toPixels(point.y)}
            r={5}
            fill={draftColor}
            />
        ))}

        {slidingPairs(allPoints).map(([start, end], lineIndex) => (
          <line
            key={lineIndex}
            x1={renderArea.toPixels(start.x)}
            y1={renderArea.toPixels(start.y)}
            x2={renderArea.toPixels(end.x)}
            y2={renderArea.toPixels(end.y)}
            stroke={draftColor}
          />
        ))}
      </g>
    );
  }

  public withContext(context: ToolContext): PolygonTool {
    return new PolygonTool(this.state, context);
  }
}
