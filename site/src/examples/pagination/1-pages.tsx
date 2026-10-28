import { useState } from "react";
import { Pagination } from "vic-ui";

export const title = "Pages of a counted list";

export default function Example() {
  const [page, setPage] = useState(1);
  const [many, setMany] = useState(6);
  return (
    <div className="demo-wide">
      <Pagination page={page} onPageChange={setPage} pageSize={50} total={312} noun="calls" />
      <Pagination page={many} onPageChange={setMany} pageSize={20} total={600} noun="recordings" />
      <Pagination page={1} onPageChange={() => {}} pageSize={50} total={34} noun="calls" />
      <Pagination page={1} onPageChange={() => {}} pageSize={50} total={0} noun="calls" />
    </div>
  );
}
