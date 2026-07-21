import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'
import { useProjects } from '@/hooks/useProjects'
import { ProjectGrid } from '@/components/works/ProjectGrid'
import { SectionHeading } from '@/components/SectionHeading'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/works/')({
  component: WorksPage,
})

function WorksPage() {
  const { t } = useTranslation()
  const { projects, loading, error } = useProjects()

  const worksJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Səhifə",
        "item": "https://mirkazim.media/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "İşlər",
        "item": "https://mirkazim.media/works"
      }
    ]
  }

  useSEO({
    title: t('works.seoTitle'),
    description: t('works.seoDescription'),
    keywords: t('seo.keywords'),
    url: 'https://mirkazim.media/works',
    jsonLd: worksJsonLd,
  })

  return (
    <div className="bg-black min-h-screen pt-24 pb-16 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        <SectionHeading title={t('works.title')} />

        {loading ? (
          <div className="w-full max-w-6xl flex flex-col gap-12 my-12">
            {[1, 2, 3].map((i) => (
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
          <ProjectGrid projects={projects} />
        )}
      </div>
    </div>
  )
}
