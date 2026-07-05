import { Search, Save, Package } from "lucide-react";
import howItWorksBg from "../assets/how-it-works-bg.jpg";

interface HowItWorksStep {
  icon: typeof Search;
  title: string;
  description: string;
}

const steps: HowItWorksStep[] = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse games across every platform",
  },
  {
    icon: Save,
    title: "Save",
    description: "Add anything that catches your eye to your library",
  },
  {
    icon: Package,
    title: "Track",
    description: "Mark games as played, keep a running log",
  },
];

function HowItWorks() {
  return (
    <section className="relative overflow-hidden min-h-[70vh] sm:min-h-screen flex justify-between items-center py-20 sm:py-0">
      <img
        src={howItWorksBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-[#131416]/80 dark:bg-[#0D0E10]/90" />

      <div className="relative w-full max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          How LATER works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-14 sm:gap-12 md:gap-24 mt-12 sm:mt-20">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex flex-col items-center">
                <Icon
                  size={32}
                  className="text-mature sm:hidden"
                  strokeWidth={1.75}
                />
                <Icon
                  size={40}
                  className="text-mature hidden sm:block"
                  strokeWidth={1.75}
                />

                <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-medium text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm sm:text-base text-notrated max-w-[240px] sm:max-w-55">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;