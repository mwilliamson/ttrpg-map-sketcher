import { AppUpdate, NumberedMapObject } from "./app";
import ObjectLabel from "./ObjectLabel";
import PropertiesTable from "./PropertiesTable";

interface ObjectViewProps {
  object: NumberedMapObject;
  sendUpdate: (update: AppUpdate) => void;
}

export default function ObjectView(props: ObjectViewProps) {
  const { object } = props;

  return (
    <PropertiesTable>
      <PropertiesTable.Row
        name="Name"
        value={(
          <ObjectLabel object={object} />
        )}
      />
    </PropertiesTable>
  );
}
