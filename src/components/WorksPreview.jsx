import React from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useProjects } from '@/hooks/useProjects'
import { ProjectGrid } from './works/ProjectGrid'
import { SectionHeading } from './SectionHeading'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function WorksPreview() {
  const { t } = useTranslation()
  const { projects, loading, error } = useProjects()

  // Filter for featured projects up to 3 items
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3)

  return (
    <section className="relative bg-black py-16 w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('/images/bg-works.png')` }}
      />
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        <SectionHeading title={t('nav.works')} />

        {loading ? (
          <div className="w-full max-w-6xl flex flex-col gap-12 my-12">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col lg:flex-row gap-8 w-full items-center">
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                  <Skeleton className="h-4 w-24 bg-border/40" />
                  <Skeleton className="h-10 w-48 bg-border/40" />
                  <Skeleton className="h-20 w-full bg-border/40" />
                </div>
                <div className="w-full lg:w-1/2">
                  <Skeleton className="h-64 w-full bg-border/40" />
                </div>
              </div>
            ))}
          </div>
        ) : error && projects.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            {t('works.error')}
          </div>
        ) : (
          <>
            <ProjectGrid projects={featuredProjects} />
            
            {/* View All Works CTA */}
            <div className="mt-8 animate-fade-up">
              <Button 
                variant="outline" 
                className="rounded-none border-border/80 text-white hover:bg-accent hover:border-accent font-heading font-semibold text-xs tracking-widest px-8 py-6 uppercase transition-all duration-300"
                asChild
              >
                <Link to="/works">
                  {t('works.subtitle', 'BÜTÜN İŞLƏR')}
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
