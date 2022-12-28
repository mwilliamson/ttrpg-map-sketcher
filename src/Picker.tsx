import "./Picker.scss";

interface PickerProps<T> {
  choices: ReadonlyArray<T>;
  layout: "horizontal" | "vertical";
  onChange: (value: T) => void;
  renderChoice: (choice: T, options: {className: string, key?: number, onClick?: () => void}) => React.ReactNode;
  value: T;
}

export default function Picker<T>(props: PickerProps<T>) {
  const { choices, layout, onChange, renderChoice, value } = props;

  return (
    <div className={`Picker--${layout}`}>
      {renderChoice(value, {className: "Picker-selected"})}
      {choices.map((choice, choiceIndex) => renderChoice(choice, {
          key: choiceIndex,
          className: "Picker-choice",
          onClick: () => onChange(choice),
      }))}
    </div>
  );
}
