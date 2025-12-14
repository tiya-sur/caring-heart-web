import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 text-foreground">
            <Heart className="w-6 h-6 text-compassion" />
            <span className="font-display font-medium text-lg">Hope & Support</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </a>
            <a
              href="/visualizer"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Visualizer
            </a>
          </nav>

          <a
            href="#contact"
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 hover:shadow-md"
          >
            Get Support
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
