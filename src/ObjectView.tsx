import { AppUpdate, NumberedMapObject, shapeColor, Token, updates } from "./app";
import ColorPicker from "./ColorPicker";
import ObjectLabel from "./ObjectLabel";
import Picker from "./Picker";
import PropertiesTable from "./PropertiesTable";

interface ObjectViewProps {
  object: NumberedMapObject;
  onDeselect: () => void;
  pageId: string;
  sendUpdate: (update: AppUpdate) => void;
}

export default function ObjectView(props: ObjectViewProps) {
  const { object, onDeselect, pageId, sendUpdate } = props;

  const color = shapeColor(object.shape);

  const token = object.shape.type === "token" ? object.shape.token : null;

  return (
    <>
      <PropertiesTable>
        <PropertiesTable.Row
          name="Name"
          value={(
            <ObjectLabel object={object} />
          )}
        />
      </PropertiesTable>

      {color !== null && (
        <ColorPicker
          layout="horizontal"
          onChange={(newColor) => sendUpdate(updates.setObjectColor({
            pageId,
            objectId: object.id,
            previousColor: color,
            color: newColor,
          }))}
          value={color}
        />
      )}

      {token !== null && (
        <TokenTextPicker
          onChange={(newText) => sendUpdate(updates.setTokenText({
            pageId,
            objectId: object.id,
            previousText: token.text,
          }))}
          value={token.text}
        />
      )}

      <button
        className="btn btn-secondary btn-variant-solid btn-sm mt-md"
        onClick={() => onDeselect()}
      >
          Deselect
      </button>
      <button
        className="btn btn-danger btn-variant-solid btn-sm mt-md ml-md"
        onClick={() => sendUpdate(updates.deleteObject({pageId, objectId: object.id}))}
      >
          Delete
      </button>
    </>
  );
}

interface TokenTextPickerProps {
  onChange: (newValue: string) => void;
  value: string;
}

function TokenTextPicker(props: TokenTextPickerProps) {
  const { onChange, value } = props;

  return (
    <Picker<string>
      choices={Token.textChoices}
      layout="horizontal"
      onChange={onChange}
      renderChoice={(choice, choiceProps) => (
        <div {...choiceProps} style={{fontFamily: "AnnieUseYourTelescope", textAlign: "center"}}>
          {choice}
        </div>
      )}
      value={value}
    />
  );
}
