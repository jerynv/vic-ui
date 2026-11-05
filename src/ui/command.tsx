// Adapted from shadcn/ui base-nova (MIT), snapshot 8a35366; see THIRD_PARTY_NOTICES.md.
import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "cn"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/ui/input-group"
import { MagnifyingGlassIcon as SearchIcon, CheckIcon } from "@/icons/icons"

type CommandItemRefs = { selectedValue: string; itemIds: ReadonlyMap<string, string>; registerItem: (value: string, id: string | null) => void }
const CommandItemRefsContext = React.createContext<CommandItemRefs | null>(null)

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  const [internalValue, setInternalValue] = React.useState(props.value ?? props.defaultValue ?? "")
  const [itemIds, setItemIds] = React.useState<ReadonlyMap<string, string>>(() => new Map())
  const registerItem = React.useCallback((value: string, id: string | null) => {
    setItemIds((current) => {
      if (id && current.get(value.trim()) === id) return current
      if (!id && !current.has(value.trim())) return current
      const next = new Map(current)
      if (id) next.set(value.trim(), id)
      else next.delete(value.trim())
      return next
    })
  }, [])
  const handleValueChange = React.useCallback((value: string) => {
    if (props.value === undefined) setInternalValue(value)
    props.onValueChange?.(value)
  }, [props.onValueChange, props.value])
  const itemRefs = React.useMemo(() => ({ selectedValue: props.value ?? internalValue, itemIds, registerItem }), [props.value, internalValue, itemIds, registerItem])
  return (
    <CommandItemRefsContext.Provider value={itemRefs}>
      <CommandPrimitive
        data-slot="command"
        className={cn(
          "flex size-full flex-col overflow-hidden rounded-(--radius-float)! bg-popover p-1 text-popover-foreground",
          className
        )}
        {...props}
        onValueChange={handleValueChange}
      />
    </CommandItemRefsContext.Provider>
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-(--radius-float)! p-0",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ref: forwardedRef,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  const refs = React.useContext(CommandItemRefsContext)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  React.useLayoutEffect(() => {
    const activeId = refs?.itemIds.get(refs.selectedValue.trim())
    if (activeId) inputRef.current?.setAttribute("aria-activedescendant", activeId)
    else inputRef.current?.removeAttribute("aria-activedescendant")
  }, [refs?.itemIds, refs?.selectedValue])
  const setInputRef = React.useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
    setRef(forwardedRef, node)
  }, [forwardedRef])
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup className="h-8! rounded-(--radius-control)! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={setInputRef}
          {...props}
        />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  value,
  ref: forwardedRef,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  const refs = React.useContext(CommandItemRefsContext)
  const setItemRef = React.useCallback((node: HTMLDivElement | null) => {
    if (value != null && node) refs?.registerItem(value, node.id)
    setRef(forwardedRef, node)
  }, [forwardedRef, refs?.registerItem, value])
  React.useLayoutEffect(() => {
    if (value == null) return
    return () => refs?.registerItem(value, null)
  }, [refs?.registerItem, value])
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-(--radius-mark) px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-(--radius-control)! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
        className
      )}
      ref={setItemRef}
      {...(value !== undefined ? { value } : {})}
      {...props}
    >
      {children}
      <CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
