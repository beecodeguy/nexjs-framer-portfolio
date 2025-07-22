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
import { Cover } from "./my-story/_components/cover";
import Link from "next/link";
import MagicButton from "@/components/magic-button";
import { FaLocationArrow } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <Hero />
        <div className="w-full flex items-center justify-center">
          <Link href="/financial-calculators">
            <MagicButton
              title="Needed Financial Calculators"
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </div>
        <div>
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Want to Hear <br />{" "}
            <Cover>
              <Link href={"/my-story"}>
                <span className="text-4xl md:text-4xl lg:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
                  My Story?
                </span>
              </Link>
            </Cover>
          </h1>
        </div>
        <Grid />
        <Experiences />
        <RecentProjects />
        <Clients />
        <WorkApproach />
      </div>
    </main>
  );
}
