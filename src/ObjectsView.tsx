import { Button } from "@chakra-ui/react";

import { AppState, AppUpdate, LineObject } from "./app";

interface ObjectsViewProps {
  onHighlightObject: (object: LineObject | null) => void;
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
}

export default function ObjectsView(props: ObjectsViewProps) {
  const { onHighlightObject, sendUpdate, state } = props;

  return (
    <div>
      {state.lines.map(lineObject => (
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
          <div>Line</div>
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
    </div>
  );
}