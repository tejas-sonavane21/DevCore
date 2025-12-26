import { Lightbulb, Code, Rocket } from "lucide-react";

const ProcessTimeline = () => {
  const steps = [
    {
      icon: Lightbulb,
      title: "Share Your Idea",
      description: "Tell us about your project requirements, deadline, and any specific features you need.",
      step: "01",
    },
    {
      icon: Code,
      title: "We Code & Document",
      description: "Our team builds your project with clean, well-documented code you can actually understand.",
      step: "02",
    },
    {
      icon: Rocket,
      title: "Deployment & Viva Prep",
      description: "We help you deploy, walk you through the code, and prepare you for any questions.",
      step: "03",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From idea to viva-ready in three simple steps
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-primary/50 transform md:-translate-x-1/2" />

          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Step number circle */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center glow-primary">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className={`ml-24 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-20 md:text-right" : "md:pl-20"}`}>
                <div className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="text-primary font-mono text-sm mb-2">Step {step.step}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
