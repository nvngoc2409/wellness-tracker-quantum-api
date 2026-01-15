import Image from "next/image"
import { DownloadButtons } from './download-buttons';

export function DownloadSection() {
  return (
    <section id="download" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-cyan-600/20" />
          <div className="absolute inset-0 backdrop-blur-3xl" />

          {/* Content */}
          <div className="relative grid lg:grid-cols-2 gap-12 items-center p-8 md:p-12 lg:p-16">
            {/* Text */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-white">Start Your Wellness </span>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Journey Today
                </span>
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Download WellQ now and experience the power of AI-driven wellness tracking combined with quantum audio
                therapy. Your path to better well-being starts here.
              </p>

              <DownloadButtons />
            </div>

            {/* App Icon */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse-glow" />
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10">
                  <Image src="/images/app-icon.png" alt="WellQ App Icon" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
