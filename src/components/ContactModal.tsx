import { useState } from "react";
import { X } from "lucide-react";
import { useContactModal } from "@/contexts/ContactModalContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const ContactModal = () => {
  const { isOpen, closeModal } = useContactModal();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your project idea");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setFormData({ name: "", phone: "", email: "", message: "" });
    closeModal();
    toast.success("Request Sent! We'll contact you shortly.");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-lg mx-4 md:mx-auto ${
          isMobile
            ? "animate-slide-up rounded-t-2xl rounded-b-none mb-0"
            : "animate-scale-in rounded-2xl"
        }`}
      >
        <div className="glass-card rounded-2xl border border-primary/20 shadow-2xl overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="relative p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Let's Build Your <span className="text-gradient">Project</span>.
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-6">
              Fill in the details below. We'll reach out to discuss your requirements.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border focus:border-primary h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border focus:border-primary h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@university.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border focus:border-primary h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Message / Project Idea <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project requirements, tech stack preferences, and deadline..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border focus:border-primary min-h-[120px] resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="glow"
                size="lg"
                className="w-full min-h-[48px] mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Submit Request"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
