import { Page } from "./app";
import ItemList from "./widgets/ItemList";

interface PagesViewProps {
  pages: ReadonlyArray<Page>;
}

export default function PagesView(props: PagesViewProps) {
  const { pages } = props;

  return (
    <ItemList>
      {pages.map(page => (
        <ItemList.Item
          key={page.id}
        >
          Page {page.id}
        </ItemList.Item>
      ))}
    </ItemList>
  );
}
