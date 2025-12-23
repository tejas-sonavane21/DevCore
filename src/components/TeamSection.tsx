import { Github, Linkedin } from "lucide-react";

const TeamSection = () => {
  const team = [
    {
      name: "Alex Chen",
      role: "Python Expert",
      bio: "Helping students ace their vivas since 2023. Django, Flask, ML - you name it.",
      skills: ["Python", "Django", "Machine Learning"],
      color: "primary",
    },
    {
      name: "Jordan Dev",
      role: "Frontend Wizard",
      bio: "Making sure your project isn't just functional, but looks stunning too.",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      color: "secondary",
    },
    {
      name: "Sam Kumar",
      role: "Database Architect",
      bio: "The one who makes sure your data flows smoothly. MySQL, PostgreSQL, MongoDB.",
      skills: ["MySQL", "PostgreSQL", "System Design"],
      color: "primary",
    },
  ];

  return (
    <section id="team" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet the <span className="text-gradient">Builders</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three friends who turned their passion for clean code into a mission to help students succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="group glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
              style={{
                boxShadow: member.color === "primary" 
                  ? "0 0 40px hsl(217 91% 60% / 0.1)" 
                  : "0 0 40px hsl(142 71% 45% / 0.1)"
              }}
            >
              {/* Avatar placeholder */}
              <div 
                className={`w-20 h-20 rounded-2xl mb-4 flex items-center justify-center text-2xl font-bold ${
                  member.color === "primary" 
                    ? "bg-primary/20 text-primary" 
                    : "bg-secondary/20 text-secondary"
                }`}
              >
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>

              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <div 
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  member.color === "primary"
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary/20 text-secondary"
                }`}
              >
                {member.role}
              </div>

              <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {member.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github size={18} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin size={18} />
                </a>
              </div>

              {/* Hover glow effect */}
              <div 
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl ${
                  member.color === "primary" ? "glow-primary" : "glow-secondary"
                }`} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
