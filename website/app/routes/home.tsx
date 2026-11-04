// Live component compositions follow shadcn's homepage and Card examples (MIT, 8a35366).
import { useState } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link } from "react-router";
import { ArrowRightIcon, CheckIcon, CodeIcon, CornerDownLeftIcon, MagnifyingGlassIcon as SearchIcon } from "vic-ui/icons";
import { Avatar, AvatarFallback, AvatarGroup, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, CodeSnippet, Field, FieldContent, FieldDescription, FieldLabel, Input, InputGroup, InputGroupAddon, InputGroupInput, Kbd, Label, Separator, Slider, Switch, Tabs, TabsContent, TabsList, TabsTrigger, toast } from "vic-ui/ui";
import { catalogue } from "../lib/catalogue";
import { baseOptions } from "../lib/layout";
import "../marketing.css";

function WorkspacePreview() {
  const [name, setName] = useState("Studio North");
  const [shared, setShared] = useState(true);
  const [created, setCreated] = useState(false);
  return <Card className="workspace-preview">
    <CardHeader><div className="mb-3 flex items-center justify-between"><span className="grid size-9 place-items-center rounded-(--radius-control) bg-primary text-primary-foreground"><CodeIcon className="size-5" /></span><Badge variant="outline">Live preview</Badge></div>
      <CardTitle className="text-xl">A home for your next idea.</CardTitle><CardDescription>Bring your people and projects together.</CardDescription>
    </CardHeader>
    <form onSubmit={event => { event.preventDefault(); setCreated(true); toast.add({ title: `${name.trim()} created`, description: "Your workspace preview is ready." }); }}>
      <CardContent className="grid gap-5">
        <Field><FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel><Input id="workspace-name" value={name} onChange={event => { setName(event.target.value); setCreated(false); }} required /></Field>
        <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Your team</span><AvatarGroup>{["JL", "AC", "MK"].map(initials => <Avatar key={initials} size="sm"><AvatarFallback>{initials}</AvatarFallback></Avatar>)}</AvatarGroup></div>
        <Separator />
        <Field orientation="horizontal"><FieldContent><FieldLabel htmlFor="workspace-sharing">Open to your team</FieldLabel><FieldDescription>{shared ? "Anyone on your team can join." : "Only people you invite can join."}</FieldDescription></FieldContent><Switch id="workspace-sharing" checked={shared} onCheckedChange={setShared} /></Field>
      </CardContent>
      <CardFooter className="mt-6"><Button className="w-full" type="submit" disabled={!name.trim()}>{created ? <><CheckIcon /> Workspace created</> : <>Create workspace <ArrowRightIcon /></>}</Button></CardFooter>
    </form>
  </Card>;
}

function Geometry() {
  return <svg className="hero-geometry" viewBox="0 0 600 600" fill="none" aria-hidden="true">
    <defs><pattern id="hero-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" stroke="currentColor" strokeOpacity=".12" /></pattern></defs>
    <rect width="600" height="600" fill="url(#hero-grid)" />
    <circle cx="480" cy="120" r="92" stroke="currentColor" strokeWidth="34" />
    <path d="M0 390h180v180H0z" fill="currentColor" fillOpacity=".08" />
    <path d="M0 570a180 180 0 0 0 180-180" stroke="currentColor" strokeWidth="36" />
    <path d="m445 470 25 25 58-58" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M70 110h60M100 80v60" stroke="currentColor" strokeWidth="2" />
  </svg>;
}

function ComponentShelf() {
  const [volume, setVolume] = useState(64);
  return <div className="component-shelf">
    <section className="shelf-item"><div className="shelf-preview flex-col gap-5"><div className="flex gap-2"><Button onClick={() => toast.add({ title: "Changes saved" })}>Save changes</Button><Button variant="outline" render={<Link to="/docs/components/button" />}>Explore</Button></div><div className="flex gap-2"><Badge>Default</Badge><Badge variant="secondary">In progress</Badge><Badge variant="outline">Draft</Badge></div></div><Link to="/docs/components/button" className="shelf-label">Actions & states <ArrowRightIcon /></Link></section>
    <section className="shelf-item"><div className="shelf-preview flex-col gap-5"><Field orientation="horizontal"><Checkbox id="shelf-updates" defaultChecked /><FieldLabel htmlFor="shelf-updates">Keep me in the loop</FieldLabel></Field><div className="grid w-full max-w-64 gap-3"><div className="flex justify-between text-sm"><Label htmlFor="shelf-volume">Volume</Label><output>{volume}%</output></div><Slider id="shelf-volume" aria-label="Preview volume" value={volume} onValueChange={value => setVolume(Array.isArray(value) ? value[0]! : value)} /></div></div><Link to="/docs/components/field" className="shelf-label">Inputs that feel right <ArrowRightIcon /></Link></section>
    <section className="shelf-item"><div className="shelf-preview"><Tabs defaultValue="overview" className="w-full max-w-64"><TabsList className="w-full"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList><TabsContent value="overview" className="pt-4 text-sm text-muted-foreground">A place for everything you’re building.</TabsContent><TabsContent value="activity" className="pt-4 text-sm text-muted-foreground">All caught up. Time for the next idea.</TabsContent></Tabs></div><Link to="/docs/components/tabs" className="shelf-label">A little more structure <ArrowRightIcon /></Link></section>
  </div>;
}

const starter = 'import "vic-ui/ui/styles.css";\nimport { Button } from "vic-ui";\n\nexport function SaveButton() {\n  return <Button>Save changes</Button>;\n}';
export default function Home() {
  const [query, setQuery] = useState("");
  const components = catalogue.filter(component => component.name.toLowerCase().includes(query.toLowerCase()));
  return <HomeLayout {...baseOptions()}>
    <title>vic/ui · Good interfaces start here.</title><meta name="description" content="Textured controls, considered states, and an owned SVG catalogue. React components with source you can read." />
    <main className="marketing">
      <section className="marketing-hero" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow"><span className="brand-dot" /> A COMPONENT LIBRARY FOR REACT</p><h1 id="hero-title">Good interfaces<br />start here.</h1>
          <p className="hero-description">The small details, already considered. Build with components that share vic’s visual language, from the first input to the finished product.</p>
          <div className="hero-actions"><Button size="lg" render={<Link to="/docs" />}>Start building <ArrowRightIcon /></Button><Button size="lg" variant="outline" render={<a href="#components" />}>Browse components</Button></div>
          <p className="hero-footnote">Textured controls. Considered states. Open source.</p>
        </div>
        <div className="hero-stage"><Geometry /><WorkspacePreview /><div className="hero-caption"><span>COMPONENTS, IN COMPOSITION</span><span>01 / {catalogue.length}</span></div></div>
      </section>
      <div className="foundation-strip"><span>One system, from the ground up.</span><span>React 19</span><span>Base UI</span><span>shadcn/ui</span><span>Fumadocs</span></div>
      <section className="marketing-section"><div className="section-heading"><div><p className="eyebrow">FEEL THE DETAILS</p><h2>Small pieces. A complete language.</h2></div><p>Keyboard behavior, clear states, consistent spacing. Try the components right here.</p></div><ComponentShelf /></section>
      <section className="getting-started"><div><p className="eyebrow">LESS SETUP, MORE MAKING</p><h2>Your next interface<br />starts with an import.</h2><p>Use the compiled stylesheet and typed components. The docs put a working preview, its source, and the API in one place.</p><Button variant="outline" render={<Link to="/docs" />}>Installation guide <CornerDownLeftIcon /></Button></div><CodeSnippet filename="save-button.tsx" code={starter} /></section>
      <section className="marketing-section" id="components"><div className="section-heading"><div><p className="eyebrow">THE COMPONENT LIBRARY</p><h2>Find your building blocks.</h2></div><InputGroup className="max-w-xs"><InputGroupAddon><SearchIcon /></InputGroupAddon><InputGroupInput aria-label="Find a component" placeholder="Find a component…" value={query} onChange={event => setQuery(event.target.value)} /><InputGroupAddon align="inline-end"><Kbd>{catalogue.length}</Kbd></InputGroupAddon></InputGroup></div>
        <div className="component-directory" aria-label="Component directory">{components.map(component => <Link key={component.id} to={`/docs/components/${component.id}`}>{component.name}<ArrowRightIcon /></Link>)}</div>
        {components.length === 0 && <p role="status" className="py-8 text-muted-foreground">No components match “{query}”. Try another name.</p>}
      </section>
      <footer className="marketing-footer"><Link to="/" className="font-mono text-xl font-semibold">vic/ui</Link><p>Thoughtful defaults. Room to make it yours.</p><a href="https://github.com/jerynv/vic-ui">Source on GitHub <ArrowRightIcon className="inline size-4" /></a></footer>
    </main>
  </HomeLayout>;
}
