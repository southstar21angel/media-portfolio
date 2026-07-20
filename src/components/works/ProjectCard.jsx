import React from 'react'
import { localize } from '@/lib/localize'
import { Play } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { VideoPlayer } from './VideoPlayer'

export function ProjectCard({ project }) {
  return (
    <div className="w-full aspect-square border border-border/20 group relative overflow-hidden transition-all duration-500 animate-fade-up">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative w-full h-full cursor-pointer bg-neutral-950">
            {/* Thumbnail Image */}
            <img 
              src={project.thumbnail} 
              alt={localize(project, 'title')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out grayscale group-hover:grayscale-0"
            />

            {/* Video Play Indicator in Top Right (Instagram style) */}
            <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md size-7 flex items-center justify-center rounded-full border border-white/10 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="size-3 fill-white text-white translate-x-[0.5px]" />
            </div>

            {/* Hover Instagram Title Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-4 transition-all duration-300 ease-out p-6 text-center">
              {/* Overlay Meta */}
              <div className="flex flex-col gap-1 select-none">
                <span className="font-heading font-black text-sm tracking-wider text-white uppercase line-clamp-2">
                  {localize(project, 'title')}
                </span>
              </div>
            </div>
          </div>
        </DialogTrigger>

        {/* Video Player Modal */}
        <DialogContent className="max-w-4xl w-[95vw] bg-black border border-border/40 p-1 flex items-center justify-center rounded-none overflow-hidden">
          <DialogTitle className="sr-only">{localize(project, 'title')}</DialogTitle>
          <div className="w-full">
            <VideoPlayer videoUrl={project.video_url} poster={project.thumbnail} autoPlay={true} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
