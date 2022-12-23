import "./PropertiesTable.scss";

interface PropertiesTableProps {
  children: React.ReactNode;
}

export default function PropertiesTable(props: PropertiesTableProps) {
  const {children} = props;

  return (
    <table className="PropertiesTable">
      <tbody>
        {children}
      </tbody>
    </table>
  );
}

interface PropertiesTableRowProps {
  name: React.ReactNode;
  value: React.ReactNode;
}

function PropertiesTableRow(props: PropertiesTableRowProps) {
  const {name, value} = props;

  return (
    <tr>
      <th>{name}</th>
      <td>{value}</td>
    </tr>
  );
}

PropertiesTable.Row = PropertiesTableRow;
