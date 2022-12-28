import { RenderArea } from ".";
import { draftColor, highlightColor } from "../colors";
import { Distance, Point, Token } from "../geometry";

interface TokenViewProps {
  opacity?: number;
  renderArea: RenderArea;
  token: Token;
}

export function TokenView(props: TokenViewProps) {
  const { opacity, renderArea, token } = props;

  const x = renderArea.toPixelCoordinate(token.center.x);
  const y = renderArea.toPixelCoordinate(token.center.y);

  return (
    <>
      <circle
        opacity={opacity}
        stroke="#000"
        strokeWidth="3"
        fill={token.color}
        cx={x}
        cy={y}
        r={renderArea.distanceToPixels(tokenRadius(renderArea))}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="AnnieUseYourTelescope"
        fontWeight="bold"
        fill="white"
        fontSize={1.6 * renderArea.distanceToPixels(tokenRadius(renderArea))}
      >
        {token.text}
      </text>
    </>
  );
}

interface TokenHighlightViewProps {
  renderArea: RenderArea;
  token: Token;
}

export function TokenHighlightView(props: TokenHighlightViewProps) {
  const { renderArea, token } = props;

  return (
    <circle
      fill={highlightColor}
      cx={renderArea.toPixelCoordinate(token.center.x)}
      cy={renderArea.toPixelCoordinate(token.center.y)}
      r={renderArea.distanceToPixels(tokenRadius(renderArea).multiply(1.5))}
    />
  );
}

interface TokenDraftViewProps {
  center: Point;
  renderArea: RenderArea;
}

export function TokenDraftView(props: TokenDraftViewProps) {
  const { center, renderArea } = props;

  return (
    <circle
      fill={draftColor}
      cx={renderArea.toPixelCoordinate(center.x)}
      cy={renderArea.toPixelCoordinate(center.y)}
      r={renderArea.distanceToPixels(tokenRadius(renderArea))}
    />
  );
}

export function tokenRadius({squareWidth}: {squareWidth: Distance}): Distance {
  return squareWidth.divide(2);
}
