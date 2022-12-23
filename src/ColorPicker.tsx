import { fillColors } from "./app/colors";

import "./ColorPicker.scss";

interface ColorPickerProps {
  onChange: (value: string) => void;
  value: string;
}

export default function ColorPicker(props: ColorPickerProps) {
  const { onChange, value } = props;

  return (
    <div className="ColorPicker--vertical">
      <div className="ColorPicker-selected" style={{backgroundColor: value}}></div>
      {fillColors.map(fillColor => (
        <div
          key={fillColor}
          className="ColorPicker-color"
          style={{backgroundColor: fillColor}}
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
    <div className="ColorPicker--horizontal">
      <div className="ColorPicker-selected" style={{backgroundColor: value}}></div>

      {fillColors.map(fillColor => (
        <div
          key={fillColor}
          className="ColorPicker-color"
          style={{backgroundColor: fillColor}}
          onClick={() => onChange(fillColor)}
        >
        </div>
      ))}
    </div>
  );
}

ColorPicker.Horizontal = ColorPickerHorizontal;
