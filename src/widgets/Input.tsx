interface InputProps {
  className?: string;
  id: string;
  onChange: (value: string) => void;
  pattern?: string;
  value: string;
}

export default function Input(props: InputProps) {
  const { className, id, onChange, pattern, value } = props;

  return (
    <input
      type="text"
      className={className}
      id={id}
      onChange={event => onChange(event.target.value)}
      pattern={pattern}
      value={value}
    />
  );
}
