import { useState } from "react";
import { X } from "lucide-react";
import { useContactModal } from "@/contexts/ContactModalContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { submitContact } from "@/lib/api";

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

    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone || undefined,
      });

      setFormData({ name: "", phone: "", email: "", message: "" });
      closeModal();
      toast.success("Request Sent! We'll contact you shortly.");
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md ${isMobile
          ? "animate-slide-up rounded-2xl mb-0 max-h-[85vh] overflow-y-auto"
          : "animate-scale-in rounded-2xl"
          }`}
      >
        <div className="glass-card rounded-2xl border border-primary/20 shadow-2xl overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Content */}
          <div className="relative p-5 md:p-6 pt-10">
            <h2 className="text-xl md:text-2xl font-bold mb-1">
              Let's Build Your <span className="text-gradient">Project</span>.
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Fill in the details below. We'll reach out to discuss your requirements.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-foreground text-sm">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Rohit Patil"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border focus:border-primary h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-foreground text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="+91 1234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border focus:border-primary h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground text-sm">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="rohitpatil@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border focus:border-primary h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-foreground text-sm">
                  Message / Project Idea <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project requirements..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border focus:border-primary min-h-[80px] resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="glow"
                size="default"
                className="w-full h-10 mt-1"
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
