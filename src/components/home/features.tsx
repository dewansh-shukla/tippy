import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wallet,
  Zap,
  Shield,
  Globe,
  MousePointer2,
  CreditCard,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Wallet className="h-10 w-10 text-primary" />,
      title: "Earn Yield Automatically",
      description:
        "Tips are automatically deposited into Euler/Infrared to generate yield",
    },
    {
      icon: <MousePointer2 className="h-10 w-10 text-primary" />,
      title: "Simple, Memorable Links",
      description:
        "Use your BeraName for clean, brandable tip links (e.g., bera.tip/yourname).",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Multiple Assets Accepted",
      description: "Accept tips in various stablecoins or tokens on Berachain.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Easy Withdrawals & Transfers",
      description: "Send funds to other addresses or generate shareable links",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
              Features
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              BeraTip provides everything you need to support your favorite
              creators with cryptocurrency
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background border-border">
              <CardHeader>
                <div className="p-2 rounded-lg w-fit bg-muted">
                  {feature.icon}
                </div>
                <CardTitle className="mt-4 font-geist-mono">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground font-dm-sans">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
