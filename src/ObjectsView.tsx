import { Box, Button, Heading } from "@chakra-ui/react";

import { AppState, AppUpdate, IndexedMapObject } from "./app";

interface ObjectsViewProps {
  onHighlightObject: (object: IndexedMapObject | null) => void;
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
}

export default function ObjectsView(props: ObjectsViewProps) {
  const { onHighlightObject, sendUpdate, state } = props;

  return (
    <Box height="100%" overflowY="scroll">
      <Heading size="md">Objects</Heading>
      {state.objects.map(lineObject => (
        <div
          key={lineObject.id}
          onMouseEnter={() => onHighlightObject(lineObject)}
          onMouseLeave={() => onHighlightObject(null)}
          style={{
            border: "1px solid #ccc",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>{lineObject.shape.type} #{lineObject.objectNumber}</div>
          <Button
            onClick={() => {
              sendUpdate({type: "deleteObject", id: lineObject.id});
              // TODO: more elegant way of dealing with hovered object?
              onHighlightObject(null);
            }}
            size="sm"
            variant="link"
          >
            Delete
          </Button>
        </div>
      ))}
    </Box>
  );
}
