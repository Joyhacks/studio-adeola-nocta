import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Hero from "./components/sections/Hero";
import Problem from "./components/sections/Problem";
import Process from "./components/sections/Process";
import Solution from "./components/sections/Solution";
import Results from "./components/sections/Results";
import CTA from "./components/sections/CTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Process />
        <Solution />
        <Results />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
