import Image from "next/image";
import Herosection from "./components/landing/Herosection";
import About from "./components/landing/About";
import Features from "./components/landing/Features";

export default function Home() {
  return (
    <div>
    <Herosection/>
   <About/>
   <Features/>
    </div>
  );
}
