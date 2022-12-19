import { RenderArea } from ".";
import slidingPairs from "../../slidingPairs";
import { draftColor, highlightColor } from "../colors";
import { Point, Polygon } from "../geometry";
import { RoughPolygon } from "../rough";

interface PolygonViewProps {
  polygon: Polygon;
  renderArea: RenderArea;
  seed: number;
}

export function PolygonView(props: PolygonViewProps) {
  const { polygon, renderArea, seed } = props;

  // TODO: memoise
  const points = polygon.points.map(point => ({
    x: renderArea.toPixelCoordinate(point.x),
    y: renderArea.toPixelCoordinate(point.y),
  }));
  return (
    <RoughPolygon
      points={points}
      seed={seed}
      fillColor={polygon.fillColor}
    />
  );
}

interface PolygonHighlightViewProps {
  polygon: Polygon;
  renderArea: RenderArea;
}

export function PolygonHighlightView(props: PolygonHighlightViewProps) {
  const { polygon, renderArea } = props;

  const pointsString = polygon.points.map(point => {
    const x = renderArea.toPixelCoordinate(point.x);
    const y = renderArea.toPixelCoordinate(point.y);
    return `${x},${y}`;
  }).join(" ");
  return (
    <polygon
      stroke={highlightColor}
      strokeWidth={5}
      fill="none"
      points={pointsString}
    />
  );
}

interface PolygonDraftViewProps {
  points: ReadonlyArray<Point>;
  renderArea: RenderArea;
}

export function PolygonDraftView(props: PolygonDraftViewProps) {
  const { points, renderArea } = props;

  return (
    <g>
      {points.map((point, pointIndex) => (
        <circle
          key={pointIndex}
          cx={renderArea.toPixelCoordinate(point.x)}
          cy={renderArea.toPixelCoordinate(point.y)}
          r={5}
          fill={draftColor}
          />
      ))}

      {slidingPairs(points).map(([start, end], lineIndex) => (
        <line
          key={lineIndex}
          x1={renderArea.toPixelCoordinate(start.x)}
          y1={renderArea.toPixelCoordinate(start.y)}
          x2={renderArea.toPixelCoordinate(end.x)}
          y2={renderArea.toPixelCoordinate(end.y)}
          stroke={draftColor}
        />
      ))}
    </g>
  );
}
