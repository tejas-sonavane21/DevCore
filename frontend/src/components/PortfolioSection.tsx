import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useRef, useEffect } from "react";
import { fetchPortfolio, PortfolioProject } from "@/lib/api";
import projectImage1 from "@/assets/project-dashboard-1.png";
import projectImage2 from "@/assets/project-dashboard-2.png";
import projectImage3 from "@/assets/project-dashboard-3.png";

// Fallback images for projects without image_url
const fallbackImages = [projectImage1, projectImage2, projectImage3];

const PortfolioSection = () => {
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Fetch portfolio projects on mount
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await fetchPortfolio();
        setProjects(data);
        setCardOrder(data.map((_, i) => i));
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPortfolio();
  }, []);

  // Helper to get image for a project
  const getProjectImage = (project: PortfolioProject, index: number): string => {
    return project.image_url || fallbackImages[index % fallbackImages.length];
  };

  const handleSwipe = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Move top card to bottom of stack
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isAnimating) return;
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    setSwipeOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(swipeOffset) > 80) {
      handleSwipe();
    } else {
      setSwipeOffset(0);
    }
    touchStartRef.current = null;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section id="portfolio" className="py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Our Projects that <span className="text-gradient">brings ideas to reality</span>.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Real projects we've delivered. Each one custom-built with clean code and comprehensive documentation.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse text-muted-foreground">Loading projects...</div>
          </div>
        </div>
      </section>
    );
  }

  // No projects fallback
  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Our Projects that <span className="text-gradient">brings ideas to reality</span>.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Real projects we've delivered. Each one custom-built with clean code and comprehensive documentation.
          </p>
        </div>
      </div>

      {/* Mobile: Swipeable card stack */}
      {isMobile ? (
        <div className="container mx-auto px-4">
          <div
            className="relative h-[520px] flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {cardOrder.map((projectIndex, stackIndex) => {
              const project = projects[projectIndex];
              if (!project) return null;
              const isTop = stackIndex === 0;
              const offset = Math.min(stackIndex, 4); // Only show 5 cards in stack

              if (stackIndex > 4) return null;

              return (
                <Card
                  key={project.id}
                  className={`glass-card overflow-hidden absolute w-[90%] max-w-[340px] min-h-[440px] flex flex-col transition-all duration-300 ease-out ${project.live_link ? 'cursor-pointer' : ''}`}
                  onClick={() => project.live_link && window.open(project.live_link, '_blank', 'noopener,noreferrer')}
                  style={{
                    transform: isTop
                      ? `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.05}deg) ${isAnimating ? 'translateX(120%) rotate(15deg)' : ''}`
                      : `translateY(${offset * 8}px) scale(${1 - offset * 0.04})`,
                    zIndex: 10 - stackIndex,
                    opacity: isTop && isAnimating ? 0 : 1 - offset * 0.15,
                    pointerEvents: isTop ? 'auto' : 'none',
                  }}
                >
                  {/* Image - Top */}
                  <div className="relative aspect-video overflow-hidden flex-shrink-0">
                    <img
                      src={getProjectImage(project, projectIndex)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-end p-4">
                      <ExternalLink className="text-primary" size={20} />
                    </div>
                  </div>

                  {/* Content - Middle & Bottom */}
                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Title & Description - Middle */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-3 text-foreground">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack - Bottom */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tech-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Swipe hint */}
          <p className="text-center text-muted-foreground text-xs mt-4">
            Swipe to see more projects
          </p>
        </div>
      ) : (
        /* Desktop/Tablet: Marquee scroll */
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee-slow hover:[animation-play-state:paused]">
            {[...projects, ...projects].map((project, index) => (
              <Card
                key={`${project.id}-${index}`}
                className="group glass-card overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer flex-shrink-0 w-[320px] sm:w-[380px] mx-3 sm:mx-4"
                onClick={() => project.live_link && window.open(project.live_link, '_blank', 'noopener,noreferrer')}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getProjectImage(project, index)}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                    <ExternalLink className="text-primary" size={20} />
                  </div>
                </div>

                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tech-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;