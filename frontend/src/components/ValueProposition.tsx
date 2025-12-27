import { Check, X } from "lucide-react";

const ValueProposition = () => {
  const comparisons = [
    {
      others: "Old recycled code from 2019",
      us: "100% custom logic built fresh",
    },
    {
      others: "Zero support or setup",
      us: "Deployment, Local Setup & Documentation",
    },
    {
      others: "Confusing undocumented mess",
      us: "Clean, commented, modern stack",
    },
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-gradient">DevForge</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're not another freelancer marketplace. We're developers who've been in your shoes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:glow-primary"
            >
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-1 rounded-full bg-destructive/20">
                    <X className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-destructive mb-1">OTHERS</div>
                    <p className="text-muted-foreground text-sm">{item.others}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-secondary/20">
                    <Check className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-secondary mb-1">DEVFORGE</div>
                    <p className="text-foreground text-sm font-medium">{item.us}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
