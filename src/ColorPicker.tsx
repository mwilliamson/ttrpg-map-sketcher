import { fillColors } from "./app/colors";

interface ColorPickerProps {
  onChange: (value: string) => void;
  value: string;
}

export default function ColorPicker(props: ColorPickerProps) {
  const { onChange, value } = props;

  return (
    <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5}}>
      <div style={{height: 40, backgroundColor: value, border: "1px solid #000", gridColumn: "1 / span 3"}}></div>
      {fillColors.map(fillColor => (
        <div
          key={fillColor}
          style={{
            backgroundColor: fillColor,
            aspectRatio: 1,
            border: "1px solid #000",
          }}
          onClick={() => onChange(fillColor)}
        >
        </div>
      ))}
    </div>
  );
}
