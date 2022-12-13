import { Tool, allTools } from "./app";

interface ToolsViewProps {
  onChange: (value: Tool) => void;
  value: Tool;
}

export default function ToolsView(props: ToolsViewProps) {
  const { onChange, value } = props;

  // TODO: uniquify
  const htmlName = "tool";

  return (
    <p>
      {allTools.map(tool => (
        <label key={tool} style={{display: "inline-block", marginRight: "2em"}}>
          <input
            type="radio"
            value={tool}
            checked={value === tool}
            onChange={event => {
              if (event.target.checked) {
                onChange(tool);
              }
            }}
          />
          {" "}
          {tool}
        </label>
      ))}
    </p>
  )
}
