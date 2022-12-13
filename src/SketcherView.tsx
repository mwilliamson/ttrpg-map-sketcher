import { useState } from "react";

import { AppState, AppUpdate, Distance, RenderArea, Scale, Tool, noneTool } from "./app";
import MapView from "./MapView";
import ToolsView from "./ToolsView";

const renderArea = RenderArea.from({
  scale: Scale.pixelsPerMetre(20),
  mapWidth: Distance.metres(40),
  mapHeight: Distance.metres(30),
  squareWidth: Distance.metres(2),
});

interface SketcherViewProps {
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
}

export default function SketcherView(props: SketcherViewProps) {
  const {state, sendUpdate} = props;

  const [tool, setTool] = useState<Tool>(noneTool);

  return (
    <div>
      <DimensionsView sendUpdate={sendUpdate} state={state} />
      <ToolsView onChange={newTool => setTool(newTool)} toolContext={{sendUpdate, squareWidth: renderArea.squareWidth}} value={tool} />
      <MapView
        renderArea={renderArea}
        sendUpdate={sendUpdate}
        state={state}
        tool={tool}
        onToolChange={newTool => setTool(newTool)}
      />
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
