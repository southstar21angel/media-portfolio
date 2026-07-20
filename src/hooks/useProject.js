import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProject(slug) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single()

        if (error) throw error
        setProject(data)
      } catch (err) {
        console.error(`Error fetching project "${slug}":`, err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  return { project, loading, error }
}
