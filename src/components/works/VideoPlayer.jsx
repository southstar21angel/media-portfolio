import React, { useState, useEffect } from 'react'

// Helper 1. YouTube detection and parsing
const getYouTubeId = (url) => {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

// Helper 2. Instagram detection and parsing
const getInstagramEmbedUrl = (url) => {
  if (!url) return null
  const cleanUrl = url.split('?')[0].split('#')[0]
  const match = cleanUrl.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/)
  return match ? `https://www.instagram.com/p/${match[1]}/embed/` : null
}

export function VideoPlayer({ videoUrl, poster, autoPlay = true }) {
  const [loading, setLoading] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(16 / 9)

  const ytId = getYouTubeId(videoUrl)
  const instagramUrl = getInstagramEmbedUrl(videoUrl)

  const handleIframeLoad = () => {
    setLoading(false)
  }

  const handleLoadedMetadata = (e) => {
    const { videoWidth, videoHeight } = e.target
    if (videoWidth && videoHeight) {
      setAspectRatio(videoWidth / videoHeight)
    }
    setLoading(false)
  }

  // Determine initial aspect ratio based on type (Called unconditionally)
  useEffect(() => {
    if (instagramUrl) {
      // Instagram embeds fit perfectly in a 3:4 aspect ratio card
      setAspectRatio(3 / 4)
    } else if (ytId) {
      setAspectRatio(16 / 9)
    }
  }, [instagramUrl, ytId])

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-neutral-900 flex items-center justify-center text-muted-foreground font-heading text-xs tracking-wider uppercase">
        No video available
      </div>
    )
  }

  if (ytId) {
    return (
      <div 
        className="relative w-full bg-black mx-auto overflow-hidden max-h-[75vh] md:max-h-[80vh]"
        style={{ aspectRatio }}
      >
        {loading && (
          <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center">
            <span className="text-accent font-heading text-xs tracking-widest animate-pulse uppercase">Loading stream...</span>
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`}
          title="YouTube Video Player"
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
        />
      </div>
    )
  }

  if (instagramUrl) {
    return (
      <div 
        className="relative w-full max-w-[450px] bg-black mx-auto overflow-hidden max-h-[75vh] md:max-h-[80vh]"
        style={{ aspectRatio }}
      >
        {loading && (
          <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center">
            <span className="text-accent font-heading text-xs tracking-widest animate-pulse uppercase">Loading Instagram post...</span>
          </div>
        )}
        <iframe
          src={instagramUrl}
          title="Instagram Video Player"
          className="w-full h-full border-0 absolute inset-0"
          scrolling="no"
          onLoad={handleIframeLoad}
        />
      </div>
    )
  }

  // 3. Direct HTML5 Video
  return (
    <div 
      className="relative w-full bg-black mx-auto overflow-hidden max-h-[75vh] md:max-h-[80vh]"
      style={{ aspectRatio }}
    >
      <video
        src={videoUrl}
        poster={poster}
        controls
        autoPlay={autoPlay}
        loop={autoPlay}
        playsInline
        className="w-full h-full object-contain absolute inset-0"
        onLoadStart={() => setLoading(true)}
        onLoadedMetadata={handleLoadedMetadata}
      >
        Your browser does not support the video tag.
      </video>
      {loading && (
        <div className="absolute inset-0 bg-neutral-950/60 flex items-center justify-center pointer-events-none">
          <span className="text-accent font-heading text-xs tracking-widest animate-pulse uppercase">Buffering...</span>
        </div>
      )}
    </div>
  )
}

