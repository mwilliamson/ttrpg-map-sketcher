import { useState } from "react";

import { AppState, AppUpdate, Distance, LineObject,RenderArea, Scale, Tool, noneTool } from "./app";
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
  const [hoveredObject, setHoveredObject] = useState<LineObject | null>(null);

  return (
    <div>
      <ToolsView onChange={newTool => setTool(newTool)} toolContext={{sendUpdate, squareWidth: renderArea.squareWidth}} value={tool} />
      <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{flex: "1 1 0"}}>
          <MapView
            renderArea={renderArea}
            sendUpdate={sendUpdate}
            state={state}
            tool={tool}
            onToolChange={newTool => setTool(newTool)}
            highlightObject={hoveredObject}
          />
        </div>
        <div style={{flex: "0 0 auto", width: 400}}>
          {state.lines.map(lineObject => (
            <div
              key={lineObject.id}
              onMouseEnter={() => setHoveredObject(lineObject)}
              onMouseLeave={() => setHoveredObject(null)}
              style={{
                border: "1px solid #ccc",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>Line</div>
              <button
                onClick={() => {
                  sendUpdate({type: "deleteObject", id: lineObject.id});
                  // TODO: more elegant way of dealing with hovered object?
                  setHoveredObject(null);
                }}
              >Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
