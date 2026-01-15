import { Button } from "@/components/ui/button"
import { Apple, Play } from "lucide-react"
export function DownloadButtons() {
    return (
        /* Download Buttons */ 
        <div className = "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" >
            <Button size="lg" className="bg-white text-background hover:bg-white/90 gap-3 h-14 px-6" asChild>
                <a href={process.env.NEXT_PUBLIC_IOS_APP_LINK} target="_blank" rel="noopener noreferrer">
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
                className="border-white/20 bg-white/5 hover:bg-white/10 gap-3 h-14 px-6"
                asChild
            >
                <a href={process.env.NEXT_PUBLIC_ANDROID_APP_LINK} target="_blank" rel="noopener noreferrer">
                    <Play className="w-6 h-6 fill-current" />
                    <div className="text-left">
                        <div className="text-xs opacity-70">Get it on</div>
                        <div className="font-semibold">Google Play</div>
                    </div>
                </a>
            </Button>
        </div >
    )
}