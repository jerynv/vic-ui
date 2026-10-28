import { useState } from "react";
import { Button, Dialog, Menu, Select, TextField } from "vic-ui";
import { UserPlusIcon } from "vic-ui/icons";

export const title = "A form, refused once";
export const note = "problem is a refusal at the foot's start. A menu or a list opened inside the dialog is in the top layer, so the dialog never clips it.";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [refused, setRefused] = useState<string | null>(null);
  const [role, setRole] = useState("member");
  const close = () => {
    setOpen(false);
    setRefused(null);
  };
  return (
    <>
      <Button look="line" onClick={() => setOpen(true)}>
        Add somebody
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => !next && close()}
        title="Add somebody"
        description="They are sent a letter saying where to sign in."
        problem={refused}
        onSubmit={(event) => {
          event.preventDefault();
          if (refused === null) setRefused("That address is already somebody here.");
          else close();
        }}
        foot={
          <>
            <Button look="line" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" icon={<UserPlusIcon size={16} />}>
              Add
            </Button>
          </>
        }
      >
        <TextField label="Email" type="email" placeholder="Enter their email" />
        <Select label="Role" items={{ admin: "Admin", member: "Member", guest: "Guest" }} value={role} onValueChange={setRole} />
        <Menu
          aria-label="More"
          items={[{ label: "Copy the invitation link", onSelect: () => undefined }, { label: "Add several at once", onSelect: () => undefined }]}
          trigger={(t) => (
            <Button look="line" {...t}>
              A menu inside a dialog
            </Button>
          )}
        />
      </Dialog>
    </>
  );
}
