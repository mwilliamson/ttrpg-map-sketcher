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

function ColorPickerHorizontal(props: ColorPickerProps) {
  const { onChange, value } = props;

  return (
    <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, 30px)", gridAutoRows: 30, gap: 5}}>
      <div style={{
        backgroundColor: value,
        border: "1px solid #000",
        gridColumn: "1 / span 2",
        gridRow: "1 / span 2"
      }}>
      </div>

      {fillColors.map(fillColor => (
        <div
          key={fillColor}
          style={{
            backgroundColor: fillColor,
            border: "1px solid #000",
          }}
          onClick={() => onChange(fillColor)}
        >
        </div>
      ))}
    </div>
  );
}

ColorPicker.Horizontal = ColorPickerHorizontal;
