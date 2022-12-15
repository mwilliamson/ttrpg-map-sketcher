import { Button, ButtonGroup, Heading, Stack } from "@chakra-ui/react";
import { Tool, ToolContext, allToolTypes } from "./app";

interface ToolsViewProps {
  onChange: (value: Tool) => void;
  toolContext: ToolContext;
  value: Tool;
}

export default function ToolsView(props: ToolsViewProps) {
  const { onChange, toolContext, value } = props;

  return (
    <Stack width={100} padding={1}>
      <Heading size="md" textAlign="center">Tools</Heading>
      {allToolTypes.map(toolType => (
        <Button
          key={toolType.name}
          colorScheme="blue"
          onClick={() => onChange(toolType.create(toolContext))}
          variant={value.type === toolType ? "solid" : "outline"}
        >
          {toolType.name}
        </Button>
      ))}
    </Stack>
  )
}
