import { range } from "lodash";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

import { AppState, AppUpdate } from "./app";

interface SketcherViewProps {
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
}

export default function SketcherView(props: SketcherViewProps) {
  const {state, sendUpdate} = props;

  const svgRef = useRef<SVGSVGElement>(null);
  const gridGroupRef = useRef<SVGGElement>(null);
  const shapeGroupRef = useRef<SVGGElement>(null);

  const mapWidthMetres = 100;
  const mapHeightMetres = 100;
  const pixelsPerMetre = 8;
  const squareWidthMetres = 5;

  useEffect(() => {
    if (svgRef.current !== null && shapeGroupRef.current !== null) {
      const rc = rough.svg(svgRef.current);
      const rect = rc.rectangle(100, 100, state.widthMetres, state.heightMetres);
      shapeGroupRef.current.replaceChildren(rect);
    }
    console.log("222");
  }, [state]);

  return (
    <div>
      <DimensionsView sendUpdate={sendUpdate} state={state} />
      <svg xmlns="http://www.w3.org/2000/svg" style={{width: mapWidthMetres * pixelsPerMetre, height: mapHeightMetres * pixelsPerMetre}} ref={svgRef}>
        <g ref={gridGroupRef} stroke="#ccc">
          {range(squareWidthMetres, mapWidthMetres, squareWidthMetres).map(x => (
            <line x1={x * pixelsPerMetre} y1={0} x2={x * pixelsPerMetre} y2={mapHeightMetres * pixelsPerMetre} />
          ))}
          {range(squareWidthMetres, mapWidthMetres, squareWidthMetres).map(y => (
            <line x1={0} y1={y * pixelsPerMetre} x2={mapWidthMetres * pixelsPerMetre} y2={y * pixelsPerMetre} />
          ))}
        </g>
        <g ref={shapeGroupRef}>
        </g>
      </svg>
    </div>
  )
}

interface DimensionsViewProps {
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
}

function DimensionsView(props: DimensionsViewProps) {
  const {state, sendUpdate} = props;

  const [widthText, setWidthText] = useState(state.widthMetres.toString());
  const [heightText, setHeightText] = useState(state.heightMetres.toString());

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    sendUpdate({type: "setDimensions", widthMetres: parseInt(widthText, 10), heightMetres: parseInt(heightText, 10)})
  }

  return (
    <p>
      <form onSubmit={handleSubmit}>
        <label>Width: <input onChange={event => setWidthText(event.target.value)} value={widthText} /></label>{" "}
        <label>Height: <input onChange={event => setHeightText(event.target.value)} value={heightText} /></label>{" "}
        <button type="submit">Apply</button>
      </form>
    </p>
  );
}
