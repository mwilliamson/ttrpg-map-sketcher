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

  useEffect(() => {
    if (svgRef.current !== null) {
      const rc = rough.svg(svgRef.current);
      const rect = rc.rectangle(100, 100, state.widthMetres, state.heightMetres);
      svgRef.current.replaceChildren(rect);
    }
    console.log("222");
  }, [state]);

  return (
    <div>
      <DimensionsView sendUpdate={sendUpdate} state={state} />
      <svg xmlns="http://www.w3.org/2000/svg" style={{width: 800, height: 800}} ref={svgRef}>
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
