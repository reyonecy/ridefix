import Image from "next/image";
import Herosection from "./components/landing/Herosection";
import About from "./components/landing/About";
import Features from "./components/landing/Features";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
export default function Home() {
  return (
    <div>
       <Navbar/>
    <Herosection/>
   <About/>
   <Features/>
   <Footer />
    </div>
  );
}
