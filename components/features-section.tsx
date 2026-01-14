import { Brain, BarChart3, Headphones, Bell, Sparkles, Heart } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced algorithms analyze your wellness patterns to understand your unique profile and provide personalized insights.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Smart Wellness Tracking",
    description:
      "Log your mood, energy, stress, and sleep daily. Visualize trends and discover what affects your well-being.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Headphones,
    title: "Quantum Audio Therapy",
    description:
      "Experience brainwave-stimulating frequencies designed to improve emotions, reduce stress, and enhance vitality.",
    color: "from-pink-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "Personalized Recommendations",
    description: "Get tailored audio sessions based on your current state and wellness data for maximum effectiveness.",
    color: "from-green-500 to-cyan-500",
  },
  {
    icon: Heart,
    title: "Holistic Wellness",
    description:
      "Address all aspects of well-being including emotional balance, energy levels, stress, and sleep quality.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Never miss logging your metrics with customizable reminders. Build consistent wellness tracking habits.",
    color: "from-yellow-500 to-orange-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Powerful Features for Your </span>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Wellness Journey
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            WellQ combines cutting-edge AI with quantum audio therapy to create a truly personalized wellness
            experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
