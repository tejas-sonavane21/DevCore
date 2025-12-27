import { Github, Linkedin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useRef, useEffect } from "react";
import { fetchTeam, TeamMember } from "@/lib/api";

const TeamSection = () => {
  const isMobile = useIsMobile();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Fetch team members on mount
  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await fetchTeam();
        setTeam(data);
        setCardOrder(data.map((_, i) => i));
      } catch (error) {
        console.error("Failed to load team:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeam();
  }, []);

  const handleSwipe = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setCardOrder((prev) => {
        const newOrder = [...prev];
        const first = newOrder.shift()!;
        newOrder.push(first);
        return newOrder;
      });
      setSwipeOffset(0);
      setIsAnimating(false);
    }, 300);
  };

  // Auto-slide every 2.5 seconds on mobile
  useEffect(() => {
    if (!isMobile || team.length === 0) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        handleSwipe();
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isMobile, isAnimating, team.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isAnimating) return;
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    setSwipeOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(swipeOffset) > 60) {
      handleSwipe();
    } else {
      setSwipeOffset(0);
    }
    touchStartRef.current = null;
  };

  // Helper to get color class
  const getColorClass = (colorTheme: string) => {
    return colorTheme === "secondary" ? "secondary" : "primary";
  };

  // Loading state
  if (isLoading) {
    return (
      <section id="team" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the <span className="text-gradient">Builders</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Developers by profession, mentors by passion. We are on a mission to make your project submission stress-free.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse text-muted-foreground">Loading team...</div>
          </div>
        </div>
      </section>
    );
  }

  // No team members fallback
  if (team.length === 0) {
    return null;
  }

  return (
    <section id="team" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet the <span className="text-gradient">Builders</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Developers by profession, mentors by passion. We are on a mission to make your project submission stress-free.
          </p>
        </div>

        {/* Mobile: Stacked swipeable cards with auto-slide */}
        {isMobile ? (
          <div
            className="relative h-[380px] flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {cardOrder.map((memberIndex, stackIndex) => {
              const member = team[memberIndex];
              if (!member) return null;
              const isTop = stackIndex === 0;
              const color = getColorClass(member.color_theme);

              return (
                <div
                  key={member.id}
                  className="group glass-card rounded-2xl p-6 absolute w-[85%] max-w-[320px] transition-all duration-300 ease-out overflow-hidden"
                  style={{
                    transform: isTop
                      ? `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.04}deg) ${isAnimating ? 'translateX(-120%) rotate(-12deg)' : ''}`
                      : `translateX(${stackIndex * 12}px) translateY(${stackIndex * 8}px) rotate(${stackIndex * 2}deg) scale(${1 - stackIndex * 0.05})`,
                    zIndex: 10 - stackIndex,
                    opacity: isTop && isAnimating ? 0 : 1 - stackIndex * 0.2,
                    pointerEvents: isTop ? 'auto' : 'none',
                    boxShadow: color === "primary"
                      ? "0 0 40px hsl(217 91% 60% / 0.15)"
                      : "0 0 40px hsl(142 71% 45% / 0.15)"
                  }}
                >
                  {/* Avatar */}
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-16 h-16 rounded-2xl mb-4 object-cover"
                    />
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-xl font-bold ${color === "primary"
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary/20 text-secondary"
                        }`}
                    >
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}

                  <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${color === "primary"
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary/20 text-secondary"
                      }`}
                  >
                    {member.role}
                  </div>

                  <p className="text-muted-foreground text-sm mb-3">{member.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {member.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-border">
                    <a href={member.github_url || "#"} className="text-muted-foreground hover:text-primary transition-colors">
                      <Github size={18} />
                    </a>
                    <a href={member.linkedin_url || "#"} className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin size={18} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop/Tablet: Original grid layout */
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member) => {
              const color = getColorClass(member.color_theme);
              return (
                <div
                  key={member.id}
                  className="group glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                  style={{
                    boxShadow: color === "primary"
                      ? "0 0 40px hsl(217 91% 60% / 0.1)"
                      : "0 0 40px hsl(142 71% 45% / 0.1)"
                  }}
                >
                  {/* Avatar */}
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-20 h-20 rounded-2xl mb-4 object-cover"
                    />
                  ) : (
                    <div
                      className={`w-20 h-20 rounded-2xl mb-4 flex items-center justify-center text-2xl font-bold ${color === "primary"
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary/20 text-secondary"
                        }`}
                    >
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${color === "primary"
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
                    <a href={member.github_url || "#"} className="text-muted-foreground hover:text-primary transition-colors">
                      <Github size={18} />
                    </a>
                    <a href={member.linkedin_url || "#"} className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin size={18} />
                    </a>
                  </div>

                  {/* Hover glow effect */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl ${color === "primary" ? "glow-primary" : "glow-secondary"
                      }`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
