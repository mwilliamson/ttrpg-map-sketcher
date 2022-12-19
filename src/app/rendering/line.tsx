import { RenderArea } from ".";
import { highlightColor } from "../colors";
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

interface LineHighlightViewProps {
  line: Line;
  renderArea: RenderArea;
}

export function LineHighlightView(props: LineHighlightViewProps) {
  const { line, renderArea } = props;

  return (
    <line
      stroke={highlightColor}
      strokeWidth={5}
      x1={renderArea.toPixelCoordinate(line.start.x)}
      y1={renderArea.toPixelCoordinate(line.start.y)}
      x2={renderArea.toPixelCoordinate(line.end.x)}
      y2={renderArea.toPixelCoordinate(line.end.y)}
    />
  )
}
