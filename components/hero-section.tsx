import { Button } from "@/components/ui/button"
import { Apple, Play } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-purple-200">AI-Powered Wellness</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-white">Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Well-Being
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience personalized audio therapy powered by AI. Track your mood, energy, stress, and sleep — then
              receive brainwave-stimulating frequencies tailored just for you.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-white text-background hover:bg-white/90 gap-3 h-14 px-6" asChild>
                <a href="https://apps.apple.com/" target="_blank" rel="noopener noreferrer">
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-70">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-border/50 bg-white/5 hover:bg-white/10 gap-3 h-14 px-6"
                asChild
              >
                <a href="https://play.google.com/" target="_blank" rel="noopener noreferrer">
                  <Play className="w-6 h-6 fill-current" />
                  <div className="text-left">
                    <div className="text-xs opacity-70">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-10 pt-10 border-t border-border/30">
              <div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="w-px h-10 bg-border/30" />
              <div>
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-sm text-muted-foreground">App Rating</div>
              </div>
              <div className="w-px h-10 bg-border/30" />
              <div>
                <div className="text-2xl font-bold text-white">100+</div>
                <div className="text-sm text-muted-foreground">Audio Tracks</div>
              </div>
            </div>
          </div>

          {/* App Preview */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 rounded-[3rem] blur-2xl" />

              {/* Phone mockup */}
              <div className="relative w-[280px] md:w-[320px] h-[580px] md:h-[660px] rounded-[3rem] bg-gradient-to-b from-gray-800 to-gray-900 p-3 shadow-2xl">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-background">
                  <Image
                    src="/images/1.webp"
                    alt="WellQ App - Goals & Insights"
                    width={320}
                    height={660}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
