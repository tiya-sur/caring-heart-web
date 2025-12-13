import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Rays of hope breaking through clouds with awareness ribbon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground animate-fade-in-up">
            Together, We Stand
            <span className="block text-primary mt-2">Against Cancer</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-delayed font-body">
            Every journey begins with hope. We're here to support, educate, and empower 
            those affected by cancer and their loved ones.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-delayed">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            >
              Get Support
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-primary text-primary font-medium transition-all hover:bg-primary/10"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Decorative scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
