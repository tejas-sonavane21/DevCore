import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import TeamSection from "@/components/TeamSection";
import TechStackMarquee from "@/components/TechStackMarquee";
import ProcessTimeline from "@/components/ProcessTimeline";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ValueProposition />
      <TeamSection />
      <TechStackMarquee />
      <ProcessTimeline />
      <Footer />
    </div>
  );
};

export default Index;
