import Input from "./Input";

interface FloatInputProps {
  className?: string;
  id: string;
  onChange: (value: string) => void;
  value: string;
}

export default function FloatInput(props: FloatInputProps) {
  const {className, id, onChange, value} = props;

  return (
    <Input
      className={className}
      id={id}
      onChange={onChange}
      pattern="[+-]?([0-9]*[.])?[0-9]+"
      value={value}
    />
  );
}
