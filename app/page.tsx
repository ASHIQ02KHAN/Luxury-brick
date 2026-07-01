
import Hero from "@/components/Hero/Hero";
import Slider from "@/components/Slider/Slider";
import BrickShowcaseClient from "@/components/BrickShowcase/BrickShowcaseClient";
import Specs from "@/components/Specs/Specs";
import Craft from "@/components/Craft/Craft";
import Manifesto from "@/components/Manifesto/Manifesto";
import MiniGame from "@/components/MiniGame/MiniGame";
import Configurator from "@/components/Configurator/Configurator";
import Footer from "@/components/Footer/Footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <Slider />
      <BrickShowcaseClient />
      <Specs />
      <Craft />
      <Manifesto />
      <MiniGame />
      <Configurator />
      <Footer />
    </main>
  );
}

