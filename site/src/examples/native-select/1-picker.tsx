import { useId } from "react";
import { NativeSelect } from "vic-ui";
export const title = "Platform picker";
export default function Example() {
  const id = useId();
  return <div className="demo-stack"><label htmlFor={id}>Course</label><NativeSelect id={id} defaultValue="math" required><option value="">Choose a course</option><option value="math">Math</option><option value="english">English</option></NativeSelect><NativeSelect aria-label="Unavailable choice" disabled><option>Unavailable</option></NativeSelect></div>;
}
