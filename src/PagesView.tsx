import * as uuid from "uuid";

import { AppUpdate, Page } from "./app";
import ItemList from "./widgets/ItemList";

interface PagesViewProps {
  onSelectPage: (pageId: string) => void;
  pages: ReadonlyArray<Page>;
  selectedPageId: string | null;
  sendUpdate: (update: AppUpdate) => void;
}

export default function PagesView(props: PagesViewProps) {
  const { onSelectPage, pages, selectedPageId, sendUpdate } = props;

  return (
    <>
      <ItemList>
        {pages.map(page => (
          <ItemList.Item
            key={page.id}
            onDelete={() => sendUpdate({type: "deletePage", id: page.id})}
            isSelected={page.id === selectedPageId}
          >
            <button
              onClick={() => onSelectPage(page.id)}
            >
              {page.name}
            </button>
          </ItemList.Item>
        ))}
      </ItemList>

      <button
        className="btn btn-secondary btn-variant-solid btn-sm mt-md"
        onClick={() => sendUpdate({type: "addPage", id: uuid.v4()})}
      >
        Add page
      </button>
    </>
  );
}
