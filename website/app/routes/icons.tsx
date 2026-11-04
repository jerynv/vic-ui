import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "../lib/layout";
import IconCatalogue from "../components/icon-catalogue";
import registry from "../../../src/icons/registry.json";

export function meta() {
  return [{ title: "Icons · vic/ui" }, { name: "description", content: "Browse, size and copy vic's SVG icon catalogue." }];
}

export default function Icons() {
  return <HomeLayout {...baseOptions()}><main className="icon-page">
    <header className="icon-intro"><h1>Icons for the details.</h1>
      <p>{registry.length} SVGs from Tabler, MingCute, IconMCP and vic. Find a shape, inspect it, make it yours. Select an icon to copy its React import.</p>
    </header>
    <IconCatalogue />
  </main></HomeLayout>;
}
