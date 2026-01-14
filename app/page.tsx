import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { ScreenshotsSection } from "@/components/screenshots-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { DownloadSection } from "@/components/download-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { CosmicBackground } from "@/components/cosmic-background"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ScreenshotsSection />
        <TestimonialsSection />
        <DownloadSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}
