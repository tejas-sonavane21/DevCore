import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectTemplate } from "@/lib/api";
import projectImage1 from "@/assets/project-dashboard-1.png";
import projectImage2 from "@/assets/project-dashboard-2.png";
import projectImage3 from "@/assets/project-dashboard-3.png";

// Fallback images
const fallbackImages = [projectImage1, projectImage2, projectImage3];

interface TechSpecsModalProps {
  project: ProjectTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  getDifficultyColor: (difficulty: string) => string;
}

const TechSpecsModal = ({ project, isOpen, onClose, getDifficultyColor }: TechSpecsModalProps) => {
  if (!isOpen || !project) return null;

  // Get image - use image_url if available, otherwise use a fallback
  const getImage = () => {
    if (project.image_url) return project.image_url;
    // Use a hash of the id to deterministically pick a fallback image
    const hash = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackImages[hash % fallbackImages.length];
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden animate-scale-in border border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-muted/80 hover:bg-muted"
          onClick={onClose}
        >
          <X size={16} />
        </Button>

        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={getImage()}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(project.difficulty)}`}>
              {project.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3 text-foreground">
            {project.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
            {project.description}
          </p>

          {/* Features (if available) */}
          {project.features && project.features.length > 0 && (
            <>
              <div className="mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Key Features
                </span>
              </div>
              <ul className="mb-5 space-y-1">
                {project.features.map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Complete Tech Stack */}
          <div className="mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Tech Stack
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tech-badge text-xs px-3 py-1.5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechSpecsModal;
