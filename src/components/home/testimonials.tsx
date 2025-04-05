import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Testimonials() {
  const testimonials = [
    {
      quote: "BiraTip has completely changed how I support my favorite content creators. It's so easy to use!",
      name: "Alex Johnson",
      role: "Crypto Enthusiast",
      avatar: "AJ",
    },
    {
      quote: "As a creator, receiving tips through BiraTip has been seamless. The platform is intuitive and secure.",
      name: "Maria Garcia",
      role: "Digital Artist",
      avatar: "MG",
    },
    {
      quote:
        "I love being able to support creators directly without intermediaries taking a cut. BiraTip is the future.",
      name: "Sam Wilson",
      role: "Tech Blogger",
      avatar: "SW",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
              What People Say
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't just take our word for it - hear from our users
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background border-border">
              <CardContent className="pt-6">
                <p className="text-lg italic text-muted-foreground">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

