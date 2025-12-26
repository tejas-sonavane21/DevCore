import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/contexts/ContactModalContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openModal } = useContactModal();

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Our Team", href: "#team" },
    { name: "Tech Stack", href: "#tech" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-gradient">{"<CodeTrio />"}</span>
          </Link>

          {/* Desktop Navigation - Hidden below 768px */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base"
              >
                {link.name}
              </a>
            ))}
            <Button variant="glow" size="default" onClick={openModal}>
              Book a Consultation
            </Button>
          </div>

          {/* Mobile Menu Button - 44px touch target */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 text-foreground rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation - Hamburger Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-2 animate-fade-in border-t border-border pt-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors py-3 px-4 rounded-lg font-medium min-h-[44px] flex items-center"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button variant="glow" className="w-full mt-2 min-h-[44px]" onClick={() => { openModal(); setIsOpen(false); }}>
              Book a Consultation
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
