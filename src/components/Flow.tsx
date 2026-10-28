import type { ReactNode } from "react";

/** One box of a flow and what follows from it. */
export interface FlowNode {
  id: string;
  content: ReactNode;
  children?: FlowNode[] | undefined;
}

/**
 * A tree drawn left to right: each box, then what follows from it in a column beside it, joined
 * by hairlines from the middle of the box to the middle of each one after it. The lines are the
 * boxes' own edges in CSS, so a box that grows keeps its lines on it with nothing measured.
 * Several `nodes` stand in a column at the start.
 */
export function Flow(props: { nodes: FlowNode[]; className?: string; "aria-label"?: string }) {
  return (
    <div className={props.className ? `ui-flow ${props.className}` : "ui-flow"} role="group" aria-label={props["aria-label"]}>
      <div className="ui-flow-column">
        {props.nodes.map((node) => (
          <Branch key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

function Branch(props: { node: FlowNode }) {
  const children = props.node.children ?? [];
  return (
    <div className="ui-flow-branch">
      <div className="ui-flow-node">{props.node.content}</div>
      {children.length > 0 ? (
        <div className="ui-flow-column ui-flow-next" data-one={children.length === 1 ? "" : undefined}>
          {children.map((child) => (
            <Branch key={child.id} node={child} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
