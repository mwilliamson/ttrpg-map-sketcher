import { useState } from "react";

import { AppState, AppUpdate } from "./app";
import MapView from "./MapView";

interface SketcherViewProps {
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
}

export default function SketcherView(props: SketcherViewProps) {
  const {state, sendUpdate} = props;

  return (
    <div>
      <DimensionsView sendUpdate={sendUpdate} state={state} />
      <MapView sendUpdate={sendUpdate} state={state} />
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
    <form onSubmit={handleSubmit}>
      <p>
        <label>Width: <input onChange={event => setWidthText(event.target.value)} value={widthText} /></label>{" "}
        <label>Height: <input onChange={event => setHeightText(event.target.value)} value={heightText} /></label>{" "}
        <button type="submit">Apply</button>
      </p>
    </form>
  );
}
