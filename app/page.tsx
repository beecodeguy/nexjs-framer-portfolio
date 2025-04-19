import Clients from "@/components/clients";
import Experiences from "@/components/experiences";
import Footer from "@/components/footer";
import Grid from "@/components/grid";
import Hero from "@/components/hero";
import RecentProjects from "@/components/recent-projects";
import { FloatingNav } from "@/components/ui/floating-navbar";
import WorkApproach from "@/components/work-approach";
import { navItems } from "@/data";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <Hero />
        <Grid />
        <Experiences />
        <RecentProjects />
        <Clients />
        <WorkApproach />
      </div>
    </main>
  );
}
