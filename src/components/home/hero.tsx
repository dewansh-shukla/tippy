import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground font-geist-mono">
                Tip Your Favorite Creators with Crypto
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                BeraTip makes it easy to support content creators with cryptocurrency. Simple, secure, and
                decentralized.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-primary text-white font-geist-mono">
                Connect Wallet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/how-it-works">
                <Button variant="outline" className="font-geist-mono">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative bg-transparent w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
              <Image src="/images/hero.png" alt="Hero" width={500} height={500} className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

