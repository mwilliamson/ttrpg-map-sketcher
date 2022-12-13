import { Tool, ToolContext, allToolTypes } from "./app";

interface ToolsViewProps {
  onChange: (value: Tool) => void;
  toolContext: ToolContext;
  value: Tool;
}

export default function ToolsView(props: ToolsViewProps) {
  const { onChange, toolContext, value } = props;

  // TODO: uniquify
  const htmlName = "tool";

  return (
    <p>
      {allToolTypes.map(toolType => (
        <label key={toolType.name} style={{display: "inline-block", marginRight: "2em"}}>
          <input
            type="radio"
            name={htmlName}
            value={toolType.name}
            checked={value.type === toolType}
            onChange={event => {
              if (event.target.checked) {
                onChange(toolType.create(toolContext));
              }
            }}
          />
          {" "}
          {toolType.name}
        </label>
      ))}
    </p>
  )
}
