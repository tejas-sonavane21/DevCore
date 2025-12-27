const TechStackMarquee = () => {
  const technologies = [
    { name: "Python", icon: "🐍" },
    { name: "Django", icon: "🎯" },
    { name: "React", icon: "⚛️" },
    { name: "MySQL", icon: "🗄️" },
    { name: "HTML", icon: "🌐" },
    { name: "Bootstrap", icon: "🅱️" },
    { name: "CSS", icon: "🎨" },
    { name: "Tailwind CSS", icon: "📐" },
    { name: "JavaScript", icon: "📜" },
    { name: "TypeScript", icon: "📘" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Node.js", icon: "🟢" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Docker", icon: "🐳" },
    { name: "Git", icon: "🌱" },
    { name: "GitHub", icon: "🌱" },
  ];

  return (
    <section id="tech" className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-2">
          Our <span className="text-gradient">Tech Stack</span>
        </h2>
        <p className="text-center text-muted-foreground text-sm">
          Modern tools for modern projects
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee">
          {[...technologies, ...technologies].map((tech, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-4 glass-card rounded-xl px-6 py-4 flex items-center gap-3 hover:scale-105 transition-transform"
            >
              <span className="text-2xl">{tech.icon}</span>
              <span className="font-medium text-foreground whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackMarquee;
