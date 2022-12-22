import { useState } from "react";

import { AppUpdate, Page, updates } from "./app";

import "./PageView.scss";

interface PageViewProps {
  page: Page;
  sendUpdate: (update: AppUpdate) => void;
}

export default function PageView(props: PageViewProps) {
  const {page, sendUpdate} = props;

  const [isEditing, setIsEditing] = useState(false);

  function handleSave(updates: ReadonlyArray<AppUpdate>) {
    for (const update of updates) {
      sendUpdate(update);
    }

    setIsEditing(false);
  }

  return isEditing ? (
    <PageEditView page={page} onSave={handleSave} />
  ) : (
    <PageReadView page={page} onEdit={() => setIsEditing(true)} />
  );
}

interface PageReadViewProps {
  onEdit: () => void;
  page: Page;
}

function PageReadView(props: PageReadViewProps) {
  const {onEdit, page} = props;
  return (
    <>
      <table className="PageView-properties">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{page.name}</td>
          </tr>
          <tr>
            <th>Width</th>
            <td>{page.dimensions.width.toString()}</td>
          </tr>
          <tr>
            <th>Height</th>
            <td>{page.dimensions.height.toString()}</td>
          </tr>
          <tr>
            <th>Square width</th>
            <td>{page.dimensions.squareWidth.toString()}</td>
          </tr>
        </tbody>
      </table>

      <button
        className="btn btn-secondary btn-variant-solid mt-md"
        onClick={onEdit}
      >
        Edit
      </button>
    </>
  );
}

interface PageEditViewProps {
  onSave: (updates: ReadonlyArray<AppUpdate>) => void;
  page: Page;
}

function PageEditView(props: PageEditViewProps) {
  const {onSave, page} = props;

  const [name, setName] = useState(page.name);

  function handleSave() {
    const pageUpdates: Array<AppUpdate> = [];

    if (name !== page.name) {
      pageUpdates.push(updates.renamePage({
        pageId: page.id,
        previousName: page.name,
        name,
      }));
    }

    onSave(pageUpdates);
  }

  return (
    <>
      <p>Name: <input type="text" onChange={event => setName(event.target.value)} value={name} /></p>

      <button
        className="btn btn-primary btn-variant-solid mt-md"
        onClick={handleSave}
      >
        Save
      </button>
    </>
  );
}
