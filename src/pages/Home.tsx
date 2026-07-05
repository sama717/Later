import About from "@/components/About"
import Contact from "@/components/Contact"
import Featured from "@/components/Featured"
import Genres from "@/components/Genres"
import Hero from "@/components/Hero"
import HowItWorks from "@/components/HowItWorks"
import LogoBar from "@/components/LogoBar"

function Home() {
  return (
    <div>
      <Hero/>
      <LogoBar/>
      <Featured/>
      <HowItWorks/>
      <Genres/>
      <About/>
      <Contact/>
    </div>
  )
}

export default Home