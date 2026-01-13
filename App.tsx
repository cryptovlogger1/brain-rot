import React, { useState } from 'react';

const TIERED_MESSAGES: Record<number, { status: string; lines: string[] }> = {
  0: {
    status: "Mostly normal",
    lines: [
      "You’re fine. The timeline hasn’t claimed you yet.",
      "Still functioning. Rare sight.",
      "Mild exposure, no permanent damage.",
      "You touch grass occasionally.",
      "Congrats, you pass as human."
    ]
  },
  20: {
    status: "Online, but manageable",
    lines: [
      "You scroll too much, but you’re still sane.",
      "Timeline resident, not a citizen.",
      "Slightly cooked, still edible.",
      "You log off… sometimes.",
      "Early signs detected."
    ]
  },
  40: {
    status: "Chronically online",
    lines: [
      "You live here now.",
      "The algorithm knows you personally.",
      "You’ve said ‘gm’ unironically.",
      "Your screen time is a secret.",
      "Grass misses you."
    ]
  },
  60: {
    status: "Fully cooked",
    lines: [
      "This is concerning.",
      "Logging off won’t save you.",
      "Your timeline is your personality.",
      "You argue with strangers for fun.",
      "You should be studied."
    ]
  },
  80: {
    status: "Beyond recovery",
    lines: [
      "It’s over.",
      "No known cure.",
      "The timeline owns you.",
      "Touching grass is no longer enough.",
      "You are the final boss."
    ]
  }
};

const LOADING_MESSAGES = [
  "Scanning timeline...",
  "Measuring brain rot...",
  "Consulting the algorithm...",
  "Analyzing questionable retweets...",
  "Checking cringe levels...",
  "Calculating lack of sunlight..."
];

function getDeterministicValue(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % max;
}

export default function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [result, setResult] = useState<{ score: number; roast: string; status: string; user: string } | null>(null);
  const [error, setError] = useState('');

  const handleCheck = () => {
    const cleanUsername = username.replace('@', '').trim().toLowerCase();
    
    if (!cleanUsername) {
      setError('Enter a username first');
      setResult(null);
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);
    
    let textIndex = 0;
    setLoadingText(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      textIndex = (textIndex + 1) % LOADING_MESSAGES.length;
      setLoadingText(LOADING_MESSAGES[textIndex]);
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      const deterministicScore = getDeterministicValue(cleanUsername, 101);
      let tierKey = 0;
      if (deterministicScore > 80) tierKey = 80;
      else if (deterministicScore > 60) tierKey = 60;
      else if (deterministicScore > 40) tierKey = 40;
      else if (deterministicScore > 20) tierKey = 20;
      else tierKey = 0;

      const tierData = TIERED_MESSAGES[tierKey];
      const lineIndex = getDeterministicValue(cleanUsername + "line", tierData.lines.length);
      const deterministicRoast = tierData.lines[lineIndex];
      
      setResult({
        score: deterministicScore,
        roast: deterministicRoast,
        status: tierData.status,
        user: cleanUsername
      });
      setLoading(false);
    }, 2000);
  };

  const handleShare = () => {
    if (!result) return;
    const shareUrl = window.location.origin;
    const tweetText = `I got ${result.score}% cooked 💀\nStatus: ${result.status}\nCheck yours 👇\n${shareUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-zinc-950 overflow-x-hidden relative font-sans text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-lg w-full z-10 flex flex-col">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-[1000] tracking-tight uppercase italic leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-600 drop-shadow-sm mb-4 px-2">
            How retard <br/>are you?
          </h1>
          <p className="text-zinc-500 font-medium tracking-[0.15em] md:tracking-[0.2em] uppercase text-[10px] md:text-xs opacity-80 px-4">
            The Industry-Leading Brain Rot Metric
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-orange-600 rounded-[2rem] md:rounded-[2.5rem] blur opacity-20 transition duration-1000"></div>
          
          <main className="relative bg-zinc-900/40 border border-white/10 p-6 md:p-12 rounded-[1.8rem] md:rounded-[2.4rem] shadow-2xl backdrop-blur-xl">
            {!loading && !result && (
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-lg md:text-xl">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                      placeholder="username"
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-xl md:rounded-2xl pl-10 md:pl-12 pr-6 py-4 md:py-5 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-zinc-700 font-medium text-white"
                    />
                  </div>
                  {error && (
                    <p className="text-rose-500 text-[10px] md:text-sm font-bold pl-2">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCheck}
                  className="group relative w-full bg-white text-black font-black py-4 md:py-5 rounded-xl md:rounded-2xl text-lg md:text-xl transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 uppercase tracking-tighter italic">Run Analysis</span>
                </button>
              </div>
            )}

            {loading && (
              <div className="py-12 md:py-16 flex flex-col items-center space-y-6 md:space-y-8">
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-rose-500/20 rounded-full"></div>
                  <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 border-t-2 border-rose-600 rounded-full animate-spin"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tight px-4">
                    {loadingText}
                  </p>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 md:space-y-8">
                <div className="flex flex-col items-center gap-4 md:gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-600 blur-2xl opacity-30 rounded-full animate-pulse"></div>
                    <img
                      src={`https://unavatar.io/twitter/${result.user}`}
                      alt={result.user}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] border-2 border-white/20 relative z-10 transition-all duration-500 object-cover shadow-2xl bg-zinc-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${result.user}/200`;
                      }}
                    />
                  </div>

                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-[1000] text-white tracking-tighter leading-none mb-1">
                      {result.score}<span className="text-rose-600 text-3xl md:text-4xl">%</span>
                    </div>
                    <p className="text-rose-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
                      Retard
                    </p>
                    <p className="text-zinc-500 text-[8px] md:text-[10px] uppercase tracking-widest mt-1 font-bold">
                      Status: {result.status}
                    </p>
                  </div>
                </div>

                <div className="relative group/roast">
                  <div className="absolute inset-0 bg-rose-600/5 rounded-xl md:rounded-2xl blur-sm transition-all"></div>
                  <div className="relative bg-white/5 border border-white/10 p-5 md:p-6 rounded-xl md:rounded-2xl text-center">
                    <p className="text-base md:text-xl font-medium text-white italic leading-relaxed">
                      "{result.roast}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 w-fit px-6 bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm transition-all opacity-80 hover:opacity-100"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                    Share on X
                  </button>

                  <button
                    onClick={() => {
                      setResult(null);
                      setUsername('');
                    }}
                    className="w-full text-zinc-500 hover:text-rose-500 transition-all text-[10px] md:text-xs font-black uppercase tracking-[0.2em] py-2"
                  >
                    Analyze another brain
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        <footer className="mt-8 md:mt-12 text-center text-zinc-500 text-[10px] md:text-xs font-medium uppercase tracking-widest px-4">
          built by{" "}
          <a 
            href="https://x.com/web3manish" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-rose-500 transition-colors font-bold underline decoration-rose-500/30 underline-offset-4 decoration-2"
          >
            Manish
          </a>
        </footer>
      </div>
    </div>
  );
}