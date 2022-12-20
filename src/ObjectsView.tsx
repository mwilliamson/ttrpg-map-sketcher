import { Box, Button, Heading } from "@chakra-ui/react";

import { AppUpdate, Page, SeededMapObject } from "./app";

interface ObjectsViewProps {
  onHighlightObject: (object: SeededMapObject | null) => void;
  page: Page;
  sendUpdate: (update: AppUpdate) => void;
}

export default function ObjectsView(props: ObjectsViewProps) {
  const { onHighlightObject, page, sendUpdate } = props;

  return (
    <Box height="100%" overflowY="scroll">
      <Heading size="md">Objects</Heading>
      {page.objects.map(lineObject => (
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
          <div>{lineObject.shape.type} #{lineObject.seed}</div>
          <Button
            onClick={() => {
              sendUpdate({type: "deleteObject", pageId: page.id, id: lineObject.id});
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
