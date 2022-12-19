import { RenderArea } from ".";
import { highlightColor } from "../colors";
import { Polygon } from "../geometry";
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
