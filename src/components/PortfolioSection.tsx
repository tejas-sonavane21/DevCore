import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import projectImage1 from "@/assets/project-dashboard-1.png";
import projectImage2 from "@/assets/project-dashboard-2.png";
import projectImage3 from "@/assets/project-dashboard-3.png";

const projects = [
  {
    id: 1,
    title: "AI Traffic Management System",
    description: "Real-time traffic analysis using computer vision and ML algorithms to optimize urban traffic flow.",
    image: projectImage1,
    tags: ["Python", "TensorFlow", "OpenCV"],
  },
  {
    id: 2,
    title: "Smart Campus Navigation",
    description: "Indoor navigation app with AR waypoints and accessibility features for university campuses.",
    image: projectImage2,
    tags: ["Flutter", "Firebase", "ARCore"],
  },
  {
    id: 3,
    title: "E-Commerce Analytics Platform",
    description: "Full-stack dashboard with predictive analytics for inventory management and sales forecasting.",
    image: projectImage3,
    tags: ["React", "Django", "PostgreSQL"],
  },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Our Projects that <span className="text-gradient">brings ideas to reality</span>.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Real projects we've delivered. Each one custom-built with clean code and comprehensive documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group glass-card overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              {/* Image Container - 16:9 aspect ratio */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
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
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                {/* Tech Tags - matching Team Section style */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tech-badge"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;