import { Card, CardContent } from "@/components/ui/card";
import { Video, TrendingUp, Map } from "lucide-react";

const benefits = [
  {
    icon: Video,
    title: "Personalized Videos",
    description: "Only watch what matters to YOUR trading journey",
  },
  {
    icon: TrendingUp,
    title: "AI Stock Analyzer",
    description: "Real-time analysis of any stock, powered by AI",
  },
  {
    icon: Map,
    title: "Custom Roadmap",
    description: "Step-by-step plan based on your answers",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index} 
                className="bg-card border-border hover:border-primary/50 transition-colors duration-300"
              >
                <CardContent className="pt-8 pb-6 px-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-2xl">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
