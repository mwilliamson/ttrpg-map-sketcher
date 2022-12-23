import { AppUpdate, Page, updates } from "./app";
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
            onDelete={() => sendUpdate(updates.deletePage({pageId: page.id}))}
            onSelect={() => onSelectPage(page.id)}
            isSelected={page.id === selectedPageId}
          >
            {page.name}
          </ItemList.Item>
        ))}
      </ItemList>

      <button
        className="btn btn-secondary btn-variant-solid btn-sm mt-md"
        onClick={() => sendUpdate(updates.addPage())}
      >
        Add page
      </button>
    </>
  );
}
