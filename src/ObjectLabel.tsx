import { NumberedMapObject } from "./app";

interface ObjectLabelProps {
  object: NumberedMapObject;
}

export default function ObjectLabel(props: ObjectLabelProps) {
  const {object} = props;

  return (
    <>{object.shape.type} #{object.objectNumber}</>
  );
}
