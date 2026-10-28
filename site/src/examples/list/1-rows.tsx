import { Badge, Button, EmptyLine, HeadCount, Row, RowGroup, Rows, RowsMore } from "vic-ui";
import { ChatCircleIcon, FileTextIcon, ClipboardTextIcon } from "vic-ui/icons";

export const title = "Groups of rows";
export const note = "One line at one height: a mark, the words, where and when, and one action at the end. A row lights only where pressing it goes somewhere. An empty group says so in an EmptyLine.";

export default function Example() {
  return (
    <div className="demo-stack" style={{ maxWidth: "40rem" }}>
      <RowGroup title="Requests" icon={ClipboardTextIcon} hue="sky" count={<HeadCount value={3} />} more={<RowsMore to="#/list">All requests</RowsMore>}>
        <Rows>
          <Row to="#/list" mark={<ClipboardTextIcon size={16} />} words="The loading bay door sticks in the cold" place="#41" when="9:40" end={<Badge tone="moving">Open</Badge>} />
          <Row to="#/list" mark={<ClipboardTextIcon size={16} />} words="Quote for the second floor's lighting" place="#38" when="Yesterday" end={<Badge tone="caution">Waiting</Badge>} />
          <Row mark={<ClipboardTextIcon size={16} />} words="New keys for the side gate" place="#35" when="Mon" end={<Button look="line">Reopen</Button>} />
        </Rows>
      </RowGroup>
      <RowGroup title="Documents" icon={FileTextIcon} hue="sage">
        <Rows>
          <Row to="#/list" mark={<FileTextIcon size={16} />} words="Service agreement, version 3" when="Oct 21" />
        </Rows>
      </RowGroup>
      <RowGroup title="Mentions" icon={ChatCircleIcon} hue="lilac">
        <EmptyLine>Nobody has named you.</EmptyLine>
      </RowGroup>
    </div>
  );
}
