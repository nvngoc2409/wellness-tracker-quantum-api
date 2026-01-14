import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    role: "Yoga Instructor",
    content:
      "WellQ has transformed my daily routine. The AI recommendations are incredibly accurate, and the quantum audio sessions help me stay centered throughout the day.",
    rating: 5,
  },
  {
    name: "David K.",
    role: "Software Engineer",
    content:
      "As someone who struggles with stress and sleep, WellQ has been a game-changer. The personalized audio therapy actually works!",
    rating: 5,
  },
  {
    name: "Emily R.",
    role: "Health Coach",
    content:
      "I recommend WellQ to all my clients. The wellness tracking combined with AI insights provides valuable data for improving overall well-being.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Loved by </span>
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Wellness Seekers
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of users who have transformed their well-being with WellQ.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-purple-500/30 transition-colors"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
