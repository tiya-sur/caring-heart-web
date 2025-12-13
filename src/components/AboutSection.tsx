import { Heart, Users, Ribbon } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Compassionate Care",
    description:
      "We provide emotional support and resources for patients and families navigating their cancer journey.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Connect with others who understand. Our community offers shared experiences and mutual encouragement.",
  },
  {
    icon: Ribbon,
    title: "Awareness & Education",
    description:
      "Learn about prevention, early detection, and treatment options through our educational programs.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Our Mission
          </h2>
          <p className="text-muted-foreground text-lg">
            We believe no one should face cancer alone. Our mission is to provide 
            hope, support, and resources to everyone affected by cancer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-border/50"
            >
              <div className="w-14 h-14 rounded-xl bg-hope-light flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
