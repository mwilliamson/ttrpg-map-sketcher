import { fillColors } from "./app/colors";

import "./ColorPicker.scss";

interface ColorPickerProps {
  layout: "horizontal" | "vertical";
  onChange: (value: string) => void;
  value: string;
}

export default function ColorPicker(props: ColorPickerProps) {
  const { layout, onChange, value } = props;

  return (
    <div className={`ColorPicker--${layout}`}>
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
