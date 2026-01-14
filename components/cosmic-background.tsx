export function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#16082a] to-[#0d0515]" />

      {/* Purple nebula effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px] animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}
