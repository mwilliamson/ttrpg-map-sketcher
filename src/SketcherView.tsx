import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { AppState, AppUpdate, Distance, LineObject,RenderArea, Scale, Tool, noneTool } from "./app";
import MapView from "./MapView";
import ObjectsView from "./ObjectsView";
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
    <Flex flexDirection="row">
      <Box flex="0 0 auto">
        <ToolsView onChange={newTool => setTool(newTool)} toolContext={{sendUpdate, squareWidth: renderArea.squareWidth}} value={tool} />
      </Box>
      <Box flex="1 1 0">
        <MapView
          renderArea={renderArea}
          sendUpdate={sendUpdate}
          state={state}
          tool={tool}
          onToolChange={newTool => setTool(newTool)}
          highlightObject={hoveredObject}
        />
      </Box>
      <Box flex="0 0 auto" width={400}>
        <ObjectsView
          onHighlightObject={setHoveredObject}
          sendUpdate={sendUpdate}
          state={state}
        />
      </Box>
    </Flex>
  )
}
