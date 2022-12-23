import "./PropertiesTable.scss";

interface PropertiesTableProps {
  children: React.ReactNode;
}

export default function PropertiesTable(props: PropertiesTableProps) {
  const {children} = props;

  return (
    <dl className="PropertiesTable">
      {children}
    </dl>
  );
}

interface PropertiesTableRowProps {
  name: React.ReactNode;
  value: React.ReactNode;
}

function PropertiesTableRow(props: PropertiesTableRowProps) {
  const {name, value} = props;

  return (
    <>
      <dt>{name}</dt>
      <dd>{value}</dd>
    </>
  );
}

PropertiesTable.Row = PropertiesTableRow;
