import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/contexts/ContactModalContext";
import heroImage from "@/assets/hero-code-blocks.png";

const HeroSection = () => {
  const { openModal } = useContactModal();

  return (
    <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      {/* Background code pattern */}
      <div className="absolute inset-0 opacity-5 font-mono text-xs leading-loose overflow-hidden pointer-events-none select-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap">
            {`const buildProject = async (idea) => { const code = await generateCleanCode(idea); return deployWithDocs(code); };`}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="animate-slide-up text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm text-muted-foreground mb-6">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Available for new projects
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Don't Just Buy Code.{" "}
              <span className="text-gradient">Build a Distinction.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Expert-led custom projects for Computer Science students. No templates,
              just clean, bug-free code built by senior developers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="glow" size="lg" className="gap-2 min-h-[44px]" asChild>
                <Link to="/project-ideas">
                  View Project Ideas
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-border hover:bg-muted/50 min-h-[44px]"
                onClick={openModal}
              >
                <MessageCircle size={18} />
                Talk to a Developer
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 sm:gap-8 justify-center lg:justify-start">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">25+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div className="w-px h-10 sm:h-12 bg-border" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-secondary">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Customer Satisfaction Rate</div>
              </div>
              <div className="w-px h-10 sm:h-12 bg-border hidden sm:block" />
              <div className="hidden sm:block">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">3</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Expert Developers</div>
              </div>
            </div>
          </div>

          <div className="relative animate-float hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="Abstract code blocks illustration"
              className="relative z-10 rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
