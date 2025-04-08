import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Link your cryptocurrency wallet to BeraTip with just a few clicks.",
    },
    {
      number: "02",
      title: "Find Your Favorite Creator",
      description: "Search for content creators or enter their wallet address directly.",
    },
    {
      number: "03",
      title: "Choose Amount & Currency",
      description: "Select how much you want to tip and which cryptocurrency to use.",
    },
    {
      number: "04",
      title: "Send Your Tip",
      description: "Confirm the transaction and send your support directly to the creator.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
              How It Works
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Supporting your favorite creators with crypto has never been easier
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-start space-y-3">
              <div className="text-4xl font-bold text-primary font-geist-mono">{step.number}</div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Button className="bg-primary text-white font-geist-mono">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

