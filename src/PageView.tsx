import { Page } from "./app";

interface PageViewProps {
  page: Page;
}

export default function PageView(props: PageViewProps) {
  const {page} = props;

  return (
    <p>Name: {page.name}</p>
  );
}
