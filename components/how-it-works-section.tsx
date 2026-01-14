import { ClipboardList, Brain, Music, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Track Your Metrics",
    description: "Log your daily wellness data across four key indicators: mood, energy, stress, and sleep quality.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analysis",
    description:
      "Our intelligent system analyzes your patterns using advanced algorithms to understand your unique profile.",
  },
  {
    icon: Music,
    step: "03",
    title: "Get Recommendations",
    description: "Receive personalized audio frequencies tailored to your current state and wellness needs.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Transform Your Life",
    description: "Experience improved mood, reduced stress, enhanced energy, and better sleep quality over time.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">How </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              WellQ Works
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A simple four-step process to transform your well-being with AI-powered insights and quantum audio therapy.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
              )}

              <div className="text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Step indicator */}
                <div className="text-cyan-400 font-mono text-sm mb-2">Step {step.step}</div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
