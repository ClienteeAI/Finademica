import { Card, CardContent } from "@/components/ui/card";
import { Video, TrendingUp, Map } from "lucide-react";

const benefits = [
  {
    icon: "🎥",
    title: "Personalized Video Library",
    description: "AI selects the exact videos you need based on your goals and experience"
  },
  {
    icon: "📊",
    title: "Professional Stock Analyzer",
    description: "Real-time AI-powered analysis of any stock, forex, or crypto"
  },
  {
    icon: "🗺️",
    title: "Custom Learning Roadmap",
    description: "Step-by-step plan designed specifically for your trading journey"
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized tools and training designed specifically for your goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group bg-card/50 backdrop-blur-lg p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
