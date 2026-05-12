import { Sparkles, Brain, Rocket, TrendingUp } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Sparkles,
    number: "01",
    title: "Answer 5 Quick Questions",
    description: "Tell us about your experience and goals"
  },
  {
    icon: Brain,
    number: "02",
    title: "AI Analyzes Your Profile",
    description: "Our system creates your personalized learning path"
  },
  {
    icon: Rocket,
    number: "03",
    title: "Access Your Dashboard",
    description: "Get instant access to videos, tools, and roadmap"
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Start Learning & Trading",
    description: "Follow your custom plan to trading success"
  }
];

const HowItWorks = () => {
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'finademica';
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our simple 4-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={cn(
                    "hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r transparent",
                    isPremiumTheme ? "from-premium-gold/50" : "from-primary/50"
                  )} />
                )}
                
                <div className={cn(
                  "relative bg-card/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                  isPremiumTheme 
                    ? "border-premium-gold/20 hover:bg-premium-gold/5 hover:border-premium-gold/40 hover:shadow-premium-gold/20" 
                    : "border-border hover:bg-card/70 hover:shadow-primary/20"
                )}>
                  {/* Number badge */}
                  <div className={cn(
                    "absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg",
                    isPremiumTheme ? "bg-premium-gold text-premium-bg" : "bg-primary text-primary-foreground"
                  )}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors",
                    isPremiumTheme 
                      ? "bg-premium-gold/20 group-hover:bg-premium-gold/30" 
                      : "bg-primary/20 group-hover:bg-primary/30"
                  )}>
                    <Icon className={cn("w-8 h-8", isPremiumTheme ? "text-premium-gold" : "text-primary")} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
