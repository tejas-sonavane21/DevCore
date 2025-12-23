import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold text-gradient">{"<CodeTrio />"}</span>
            <p className="text-muted-foreground text-sm mt-2">
              Building distinction, one project at a time.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="p-3 glass-card rounded-xl text-muted-foreground hover:text-primary hover:glow-primary transition-all duration-300"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="p-3 glass-card rounded-xl text-muted-foreground hover:text-primary hover:glow-primary transition-all duration-300"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:hello@codetrio.dev"
              className="p-3 glass-card rounded-xl text-muted-foreground hover:text-primary hover:glow-primary transition-all duration-300"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CodeTrio. All rights reserved.</p>
          <p className="mt-1 font-mono text-xs">Made with ❤️ for CS students everywhere</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
