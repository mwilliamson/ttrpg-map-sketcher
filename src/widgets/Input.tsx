interface InputProps {
  className?: string;
  id?: string;
  maxLength?: number;
  onChange: (value: string) => void;
  pattern?: string;
  style?: React.CSSProperties;
  value: string;
}

export default function Input(props: InputProps) {
  const { className, id, maxLength, onChange, pattern, style, value } = props;

  return (
    <input
      type="text"
      className={className}
      id={id}
      maxLength={maxLength}
      onChange={event => onChange(event.target.value)}
      pattern={pattern}
      style={style}
      value={value}
    />
  );
}
