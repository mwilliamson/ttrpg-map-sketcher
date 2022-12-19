import { RenderArea } from ".";
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
