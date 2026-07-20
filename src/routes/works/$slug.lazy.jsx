import React from 'react'
import { createLazyFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'
import { ChevronLeft, Expand } from 'lucide-react'
import { useProject } from '@/hooks/useProject'
import { localize } from '@/lib/localize'
import { VideoPlayer } from '@/components/works/VideoPlayer'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export const Route = createLazyFileRoute('/works/$slug')({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { slug } = Route.useParams()
  const { project, loading, error } = useProject(slug)
  const { t } = useTranslation()
  const router = useRouter()

  const seoTitle = project 
    ? `${localize(project, 'title')} | Mirkazim Media` 
    : loading 
      ? `${t('project.loading', 'Loading project...')} | Mirkazim Media`
      : `Project Not Found | Mirkazim Media`

  const seoDesc = project 
    ? localize(project, 'description') 
    : ''

  const seoImage = project?.thumbnail || ''

  useSEO({
    title: seoTitle,
    description: seoDesc,
    keywords: project 
      ? `${localize(project, 'title')}, ${localize(project, 'category')}, Mirkazim Media, videoqraf, Baku` 
      : '',
    image: seoImage,
  })

  if (loading) {
    return (
      <div className="bg-black min-h-screen pt-24 pb-16 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <Skeleton className="h-6 w-24 bg-border/40" />
          <Skeleton className="h-12 w-64 bg-border/40" />
          <Skeleton className="h-96 w-full bg-border/40" />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="bg-black min-h-screen pt-24 pb-16 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-white text-2xl font-heading mb-4">
          {t('project.error', 'Project not found.')}
        </h2>
        <Button variant="outline" className="rounded-none text-white border-border/80 uppercase tracking-widest text-xs" asChild>
          <Link to="/works">{t('project.back')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen pt-24 pb-16 w-full text-left font-body">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-white hover:bg-transparent -ml-3 mb-6 flex items-center gap-1 font-heading text-xs tracking-wider uppercase rounded-none"
          onClick={() => router.history.back()}
        >
          <ChevronLeft className="size-4" />
          {t('project.back')}
        </Button>

        {/* Project Header */}
        <div className="mb-10 animate-fade-up">
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tighter leading-none">
            {localize(project, 'title')}
          </h1>
        </div>

        {/* Inline video player */}
        <div className="w-full max-w-4xl mx-auto overflow-hidden border border-border/40 mb-12 animate-fade-up bg-black">
          <VideoPlayer videoUrl={project.video_url} poster={project.thumbnail} autoPlay={false} />
        </div>

        {/* Project Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-border/40 pb-10 mb-10 animate-fade-up">
          {/* Col 1: Description */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-xs tracking-widest text-accent uppercase">
              {t('project.description')}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">
              {localize(project, 'description')}
            </p>
          </div>
        </div>

        {/* Project Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="w-full animate-fade-up">
            <h3 className="font-heading font-bold text-xs tracking-widest text-accent uppercase mb-6">
              {t('project.gallery', 'Qalereya')}
            </h3>

            <div className="px-6 md:px-12 relative w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {project.images.map((imgUrl, index) => (
                    <CarouselItem key={index} className="basis-full">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative group overflow-hidden border border-border/40 cursor-pointer">
                            <AspectRatio ratio={16 / 9}>
                              <img 
                                src={imgUrl} 
                                alt={`Gallery ${index}`} 
                                className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                              />
                            </AspectRatio>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                              <Expand className="text-white size-8" />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-black border border-border/40 p-1 flex items-center justify-center rounded-none">
                          <DialogTitle className="sr-only">Image Zoom</DialogTitle>
                          <img src={imgUrl} alt={`Zoom ${index}`} className="w-full h-auto object-contain max-h-[85vh]" />
                        </DialogContent>
                      </Dialog>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 md:-left-6 text-white hover:text-accent border-border/40 hover:bg-transparent" />
                <CarouselNext className="right-0 md:-right-6 text-white hover:text-accent border-border/40 hover:bg-transparent" />
              </Carousel>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
