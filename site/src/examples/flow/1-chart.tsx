import { Card, Flow } from "vic-ui";

export const title = "A chart";

export default function Example() {
  return (
    <div className="demo-wide">
      <Flow
        aria-label="A chart"
        nodes={[
          {
            id: "chair",
            content: <Card>Chair</Card>,
            children: [
              { id: "treasurer", content: <Card>Treasurer</Card>, children: [{ id: "auditor", content: <Card>Auditor</Card> }] },
              { id: "secretary", content: <Card>Secretary</Card> },
              { id: "vacant", content: <Card>Vacant seat</Card> },
            ],
          },
        ]}
      />
    </div>
  );
}
