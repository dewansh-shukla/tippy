import { Hero } from "@/components/home/hero"
import { Features } from "@/components/home/features"
import { HowItWorks } from "@/components/home/how-it-works"
import { Testimonials } from "@/components/home/testimonials"
import { CTA } from "@/components/home/cta"

export default function Home() {
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen">
      <Hero />
      <CTA />
      <Features />
      <HowItWorks />
      <Testimonials />
    </div>
  )
}

