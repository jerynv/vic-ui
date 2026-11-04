import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link } from "react-router";
import { Button, TypographyH1, TypographyLead } from "vic-ui/ui";
import { baseOptions } from "../lib/layout";
import { SliderExample } from "../components/slider-example";

export default function Home() {
  return <HomeLayout {...baseOptions()}>
    <title>vic/ui · React components</title><meta name="description" content="React components built on shadcn and Base UI, with a shared visual language." />
    <main className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
      <div className="space-y-6"><TypographyH1>Build consistent React interfaces.</TypographyH1>
        <TypographyLead>66 component families. One shared visual language. Built on shadcn and Base UI.</TypographyLead>
        <Button render={<Link to="/docs" />}>Explore the components</Button>
      </div><SliderExample />
    </main>
  </HomeLayout>;
}
