import { Announcement } from "vic-ui";

export const title = "Tags in hues and the accent";

export default function Example() {
  return (
    <div className="demo-wide">
      <Announcement href="#/announcement" tag="New">
        Calls in every group
      </Announcement>
      <Announcement href="#/announcement" tag="New" tone="accent">
        Projects keep their own instructions
      </Announcement>
      <Announcement to="#/announcement" tag="Calendar" hue="sage">
        Free time found for you
      </Announcement>
      <Announcement href="#/announcement" tag="Visitors" hue="lilac">
        Let people from outside into a call
      </Announcement>
      <Announcement href="#/announcement">Words alone, with no tag</Announcement>
    </div>
  );
}
