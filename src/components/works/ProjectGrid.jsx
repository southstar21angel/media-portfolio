import React from 'react'
import { ProjectCard } from './ProjectCard'

export function ProjectGrid({ projects }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full max-w-6xl mx-auto py-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.id || project.slug} project={project} index={index} />
      ))}
    </div>
  )
}
