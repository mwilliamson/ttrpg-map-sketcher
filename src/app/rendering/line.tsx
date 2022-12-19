import { RenderArea } from ".";
import { Line } from "../geometry";
import { RoughLine } from "../rough";

interface LineViewProps {
  line: Line;
  renderArea: RenderArea;
  seed: number;
}

export function LineView(props: LineViewProps) {
  const { line, renderArea, seed } = props;

  return (
    <RoughLine
      x1={renderArea.toPixelCoordinate(line.start.x)}
      y1={renderArea.toPixelCoordinate(line.start.y)}
      x2={renderArea.toPixelCoordinate(line.end.x)}
      y2={renderArea.toPixelCoordinate(line.end.y)}
      seed={seed}
    />
  )
}
