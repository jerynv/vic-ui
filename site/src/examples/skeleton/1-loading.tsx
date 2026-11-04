import { Skeleton } from "vic-ui";
export const title = "A single loading announcement";
export default function Example() {
  return <div className="demo-stack" role="status" aria-label="Loading course details"><Skeleton style={{ width: "12rem", height: "1rem" }} /><Skeleton style={{ width: "18rem", height: "1rem" }} /></div>;
}
