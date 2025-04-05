import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5 flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
              Ready to Start Tipping?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of users supporting their favorite creators with cryptocurrency
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button className="bg-primary text-white font-geist-mono">Create Account</Button>
            <Link href="/explore">
              <Button variant="outline" className="font-geist-mono">
                Explore Creators
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

