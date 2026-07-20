import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Lock,
  Plus,
  Edit,
  Trash2,
  Loader2,
  LogOut,
  ArrowLeft,
  Video,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react'

export const Route = createLazyFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const { t } = useTranslation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Editor Modal / Form State
  const [editingProject, setEditingProject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)

  // Form Fields
  const [slug, setSlug] = useState('')
  const [titleAz, setTitleAz] = useState('')
  const [titleRu, setTitleRu] = useState('')
  const [descriptionAz, setDescriptionAz] = useState('')
  const [descriptionRu, setDescriptionRu] = useState('')
  const [featured, setFeatured] = useState(false)
  const [sortOrder, setSortOrder] = useState(0)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  // Upload States
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [thumbProgress, setThumbProgress] = useState(0)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [uploadedFilesSession, setUploadedFilesSession] = useState([])

  const activeUploads = useRef({ thumb: null, video: null })

  // Handle Login using Supabase Auth
  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    try {
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (loginErr) throw loginErr
    } catch (err) {
      console.error('Login error:', err)
      setAuthError(err.message || t('admin.login.error'))
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Check login session on mount
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    // Listen to session updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch projects from DB
  const fetchAdminProjects = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error: dbError } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (dbError) throw dbError
      setProjects(data || [])
    } catch (err) {
      console.error('Error fetching admin projects:', err)
      setError(err.message || t('admin.dashboard.loading'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminProjects()
    }
  }, [isAuthenticated, fetchAdminProjects])

  // Open editor for new project
  const handleNewProject = () => {
    setEditingProject(null)
    setSlug('')
    setTitleAz('')
    setTitleRu('')
    setDescriptionAz('')
    setDescriptionRu('')
    setFeatured(false)
    setSortOrder(projects.length + 1)
    setThumbnailUrl('')
    setVideoUrl('')
    setUploadedFilesSession([])
    setShowForm(true)
  }

  // Open editor for existing project
  const handleEditProject = (proj) => {
    setEditingProject(proj)
    setSlug(proj.slug)
    setTitleAz(proj.title_az || '')
    setTitleRu(proj.title_ru || '')
    setDescriptionAz(proj.description_az || '')
    setDescriptionRu(proj.description_ru || '')
    setFeatured(!!proj.featured)
    setSortOrder(proj.sort_order || 0)
    setThumbnailUrl(proj.thumbnail || '')
    setVideoUrl(proj.video_url || '')
    setUploadedFilesSession([])
    setShowForm(true)
  }

  // Generate slug dynamically from title if empty
  const handleTitleBlur = () => {
    if (!slug && titleAz) {
      const generated = titleAz
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setSlug(generated)
    }
  }

  // File Upload Helper via XMLHttpRequest to track progress (synchronous Promise executor to satisfy linter)
  const uploadFileWithProgress = (filePath, file, type, onProgress) => {
    return new Promise((resolve, reject) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''

        const url = `${supabaseUrl}/storage/v1/object/portfolio-media/${filePath}`

        const xhr = new XMLHttpRequest()
        if (type) {
          activeUploads.current[type] = xhr
        }

        xhr.open('POST', url, true)

        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_ANON_KEY || '')
        xhr.setRequestHeader('x-upsert', 'true')
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100
            onProgress(Math.round(percent))
          }
        }

        xhr.onload = () => {
          if (type) activeUploads.current[type] = null
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              resolve(response)
            } catch {
              resolve({ path: filePath })
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`))
          }
        }

        xhr.onerror = () => {
          if (type) activeUploads.current[type] = null
          reject(new Error('Network error during upload.'))
        }

        xhr.onabort = () => {
          if (type) activeUploads.current[type] = null
          reject(new Error('Upload aborted by user.'))
        }

        xhr.send(file)
      }).catch((err) => {
        if (type) activeUploads.current[type] = null
        reject(err)
      })
    })
  }

  // File Upload Helper to Supabase Storage (Thumbnails only)
  const handleThumbnailUpload = async (file) => {
    if (!file) return

    try {
      setUploadingThumb(true)
      setThumbProgress(0)

      const fileExt = file.name.split('.').pop()
      const fileName = `thumbnail-${Math.random().toString(36).substring(2, 10)}-${Date.now()}.${fileExt}`
      const filePath = `thumbnails/${fileName}` // e.g. thumbnails/thumbnail-xyz.png

      await uploadFileWithProgress(filePath, file, 'thumb', (progress) => {
        setThumbProgress(progress)
      })

      setUploadedFilesSession(prev => [...prev, filePath])

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath)

      setThumbnailUrl(publicUrlData.publicUrl)
    } catch (err) {
      if (err.message !== 'Upload aborted by user.') {
        console.error('Thumbnail upload failed:', err)
        alert(`Upload failed: ${err.message || 'Unknown error'}`)
      }
    } finally {
      setUploadingThumb(false)
    }
  }

  // File Upload Helper to Supabase Storage (Videos)
  const handleVideoUpload = async (file) => {
    if (!file) return

    // 100MB limit = 100 * 1024 * 1024 bytes
    const MAX_SIZE = 100 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      alert(t('admin.form.videoSizeError') || 'Video size exceeds 100MB limit!')
      return
    }

    try {
      setUploadingVideo(true)
      setVideoProgress(0)

      const fileExt = file.name.split('.').pop()
      const fileName = `video-${Math.random().toString(36).substring(2, 10)}-${Date.now()}.${fileExt}`
      const filePath = `videos/${fileName}`

      await uploadFileWithProgress(filePath, file, 'video', (progress) => {
        setVideoProgress(progress)
      })

      setUploadedFilesSession(prev => [...prev, filePath])

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath)

      setVideoUrl(publicUrlData.publicUrl)
    } catch (err) {
      if (err.message !== 'Upload aborted by user.') {
        console.error('Video upload failed:', err)
        alert(`Upload failed: ${err.message || 'Unknown error'}`)
      }
    } finally {
      setUploadingVideo(false)
    }
  }

  // Handle Cancel Form (removes any temporary uploaded files in the current editing session)
  const handleCancelForm = async () => {
    // 1. Abort any ongoing uploads immediately
    if (activeUploads.current.thumb) {
      activeUploads.current.thumb.abort()
      activeUploads.current.thumb = null
    }
    if (activeUploads.current.video) {
      activeUploads.current.video.abort()
      activeUploads.current.video = null
    }

    // 2. Clean up files that were already fully uploaded in this session
    if (uploadedFilesSession.length > 0) {
      try {
        const { error: storageErr } = await supabase.storage
          .from('portfolio-media')
          .remove(uploadedFilesSession)

        if (storageErr) {
          console.error('Error cleaning up session uploads:', storageErr)
        }
      } catch (err) {
        console.error('Error during cleanup:', err)
      }
    }
    setUploadedFilesSession([])
    setShowForm(false)
  }

  // Save Project
  const handleSaveProject = async (e) => {
    e.preventDefault()
    if (!slug) return alert(t('admin.form.slugRequired'))
    if (!titleAz || !titleRu) return alert(t('admin.form.titleRequired'))

    const projectData = {
      slug,
      title_az: titleAz,
      title_ru: titleRu,
      description_az: descriptionAz,
      description_ru: descriptionRu,
      featured,
      sort_order: parseInt(sortOrder) || 0,
      thumbnail: thumbnailUrl,
      video_url: videoUrl,
    }

    try {
      setSaving(true)

      let resError = null

      if (editingProject) {
        // Update
        const { error: updateErr } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)
        resError = updateErr
      } else {
        // Insert
        const { error: insertErr } = await supabase
          .from('projects')
          .insert([projectData])
        resError = insertErr
      }

      if (resError) throw resError

      // Clean up old replaced files from storage if editing
      if (editingProject) {
        const oldFilesToDelete = []
        if (editingProject.thumbnail && editingProject.thumbnail !== thumbnailUrl) {
          const oldThumbPath = getStoragePathFromUrl(editingProject.thumbnail)
          if (oldThumbPath) oldFilesToDelete.push(oldThumbPath)
        }
        if (editingProject.video_url && editingProject.video_url !== videoUrl) {
          const oldVideoPath = getStoragePathFromUrl(editingProject.video_url)
          if (oldVideoPath) oldFilesToDelete.push(oldVideoPath)
        }
        if (oldFilesToDelete.length > 0) {
          await supabase.storage.from('portfolio-media').remove(oldFilesToDelete)
        }
      }

      setUploadedFilesSession([])
      setShowForm(false)
      fetchAdminProjects()
    } catch (err) {
      console.error('Error saving project:', err)
      alert(`Save failed: ${err.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  // Extract storage file path from Supabase public URL
  const getStoragePathFromUrl = (url) => {
    if (!url) return null
    const marker = '/storage/v1/object/public/portfolio-media/'
    const index = url.indexOf(marker)
    if (index !== -1) {
      return url.substring(index + marker.length)
    }
    return null
  }

  // Delete Project
  const handleDeleteProject = async (proj) => {
    if (!proj) return

    try {
      setLoading(true)

      const pathsToDelete = []

      const thumbPath = getStoragePathFromUrl(proj.thumbnail)
      if (thumbPath) pathsToDelete.push(thumbPath)

      const videoPath = getStoragePathFromUrl(proj.video_url)
      if (videoPath) pathsToDelete.push(videoPath)

      if (proj.images && Array.isArray(proj.images)) {
        proj.images.forEach(imgUrl => {
          const imgPath = getStoragePathFromUrl(imgUrl)
          if (imgPath) pathsToDelete.push(imgPath)
        })
      }

      if (pathsToDelete.length > 0) {
        const { error: storageErr } = await supabase.storage
          .from('portfolio-media')
          .remove(pathsToDelete)

        if (storageErr) {
          console.error('Error deleting files from storage:', storageErr)
        }
      }

      const { error: deleteErr } = await supabase
        .from('projects')
        .delete()
        .eq('id', proj.id)

      if (deleteErr) throw deleteErr

      setProjectToDelete(null)
      fetchAdminProjects()
    } catch (err) {
      console.error('Error deleting project:', err)
      alert(`Delete failed: ${err.message || 'Unknown error'}`)
      setLoading(false)
    }
  }

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-neutral-900/60 border border-border/40 p-8 flex flex-col items-center gap-6 animate-fade-up">
          <div className="w-16 h-16 rounded-full border border-accent flex items-center justify-center">
            <Lock className="text-accent size-6 animate-pulse" />
          </div>
          <div className="text-center">
            <h1 className="font-heading font-black text-2xl uppercase tracking-wider text-white">
              {t('admin.login.title')}
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {t('admin.login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest">
                {t('admin.login.emailLabel')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.login.emailPlaceholder')}
                className="w-full bg-black border border-border/40 focus:border-accent outline-none text-white text-sm px-4 py-3 rounded-none font-body transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest">
                {t('admin.login.passwordLabel')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.login.passwordPlaceholder')}
                className="w-full bg-black border border-border/40 focus:border-accent outline-none text-white text-sm px-4 py-3 rounded-none font-body transition-colors"
              />
            </div>
            {authError && (
              <p className="text-red-500 text-xs font-body font-light">{authError}</p>
            )}
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/80 text-black font-heading font-bold uppercase tracking-widest text-xs py-6 rounded-none w-full mt-2"
            >
              {t('admin.login.submit')}
            </Button>
          </form>

          <Link
            to="/works"
            className="text-xs text-muted-foreground hover:text-white uppercase tracking-widest flex items-center gap-2 mt-2 transition-colors"
          >
            <ArrowLeft className="size-3" /> {t('admin.login.back')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen pt-24 pb-16 w-full text-left font-body">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border/40 pb-6 mb-8 gap-4">
          <div>
            <h1 className="font-heading font-black text-4xl text-white uppercase tracking-tight leading-none">
              {t('admin.dashboard.title')}
            </h1>
            <p className="text-accent font-heading font-semibold text-xs tracking-widest uppercase mt-1">
              {t('admin.dashboard.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleNewProject}
              className="rounded-none border-accent hover:bg-accent hover:text-black text-accent font-heading uppercase tracking-widest text-xs flex items-center gap-2"
            >
              <Plus className="size-4" /> {t('admin.dashboard.addProject')}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="rounded-none hover:bg-neutral-900 text-muted-foreground hover:text-white font-heading uppercase tracking-widest text-xs flex items-center gap-2"
            >
              <LogOut className="size-4" /> {t('admin.dashboard.logout')}
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        {showForm ? (
          /* PROJECT EDITOR FORM */
          <div className="bg-neutral-900/40 border border-border/40 p-6 md:p-8 animate-fade-up max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-border/30 pb-4 mb-6">
              <h2 className="text-xl font-heading font-black uppercase tracking-wider text-white">
                {editingProject ? t('admin.dashboard.editTitle', { slug: editingProject.slug }) : t('admin.dashboard.createTitle')}
              </h2>
              <button
                type="button"
                onClick={handleCancelForm}
                className="text-xs text-muted-foreground hover:text-white uppercase tracking-widest font-heading"
              >
                {t('admin.dashboard.cancel')}
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Properties */}
                <div className="flex flex-col gap-4">
                  
                  {/* Title AZ */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest">
                      {t('admin.form.titleAz')}
                    </label>
                    <input
                      type="text"
                      required
                      value={titleAz}
                      onChange={(e) => setTitleAz(e.target.value)}
                      onBlur={handleTitleBlur}
                      placeholder={t('admin.form.titleAzPlaceholder')}
                      className="bg-black border border-border/40 focus:border-accent outline-none text-white text-sm px-4 py-2.5 rounded-none font-body"
                    />
                  </div>

                  {/* Title RU */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest">
                      {t('admin.form.titleRu')}
                    </label>
                    <input
                      type="text"
                      required
                      value={titleRu}
                      onChange={(e) => setTitleRu(e.target.value)}
                      placeholder={t('admin.form.titleRuPlaceholder')}
                      className="bg-black border border-border/40 focus:border-accent outline-none text-white text-sm px-4 py-2.5 rounded-none font-body"
                    />
                  </div>

                  {/* Slug */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest">
                      {t('admin.form.slug')}
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder={t('admin.form.slugPlaceholder')}
                      className="bg-black border border-border/40 focus:border-accent outline-none text-white text-sm px-4 py-2.5 rounded-none font-body"
                    />
                  </div>

                  {/* Sort Order */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest">
                      {t('admin.form.sortOrder')}
                    </label>
                    <input
                      type="number"
                      required
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="bg-black border border-border/40 focus:border-accent outline-none text-white text-sm px-4 py-2.5 rounded-none font-body"
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-3 py-2 border-t border-b border-border/20 mt-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="accent-accent size-4"
                    />
                    <label htmlFor="featured" className="text-sm font-heading uppercase tracking-wider text-white cursor-pointer select-none">
                      {t('admin.form.featured')}
                    </label>
                  </div>
                </div>

                {/* Right Column: Descriptions & Assets Upload */}
                <div className="flex flex-col gap-4">
                  
                  {/* Description AZ */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest">
                      {t('admin.form.descriptionAz')}
                    </label>
                    <textarea
                      rows={3}
                      value={descriptionAz}
                      onChange={(e) => setDescriptionAz(e.target.value)}
                      placeholder={t('admin.form.descriptionAzPlaceholder')}
                      className="bg-black border border-border/40 focus:border-accent outline-none text-white text-sm px-4 py-2.5 rounded-none font-body resize-none"
                    />
                  </div>

                  {/* Description RU */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest">
                      {t('admin.form.descriptionRu')}
                    </label>
                    <textarea
                      rows={3}
                      value={descriptionRu}
                      onChange={(e) => setDescriptionRu(e.target.value)}
                      placeholder={t('admin.form.descriptionRuPlaceholder')}
                      className="bg-black border border-border/40 focus:border-accent outline-none text-white text-sm px-4 py-2.5 rounded-none font-body resize-none"
                    />
                  </div>

                  {/* Thumbnail Image Section */}
                  <div className="border border-border/20 p-4 bg-black/40 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white tracking-wider font-heading uppercase flex items-center gap-1.5">
                        <ImageIcon className="size-3.5 text-accent" /> {t('admin.form.thumbnailTitle')}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        placeholder={t('admin.form.thumbnailPlaceholder')}
                        className="bg-black border border-border/40 focus:border-accent outline-none text-white text-xs px-3 py-2 rounded-none font-body"
                      />
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          id="thumb-upload"
                          className="hidden"
                          onChange={(e) => handleThumbnailUpload(e.target.files[0])}
                          disabled={uploadingThumb}
                        />
                        <label
                          htmlFor="thumb-upload"
                          className="bg-neutral-800 hover:bg-neutral-700 text-white font-heading text-[10px] tracking-widest uppercase py-2 px-3 cursor-pointer select-none transition-colors border border-border/40"
                        >
                          {uploadingThumb ? t('admin.form.thumbnailUploading') : t('admin.form.thumbnailUpload')}
                        </label>
                      </div>

                      {uploadingThumb && (
                        <div className="w-full bg-neutral-800 h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-accent h-full transition-all duration-300"
                            style={{ width: `${thumbProgress}%` }}
                          />
                        </div>
                      )}

                      {thumbnailUrl && (
                        <div className="mt-2 w-32 border border-border/40 overflow-hidden">
                          <AspectRatio ratio={16/9}>
                            <img src={thumbnailUrl} alt="Thumbnail Preview" className="object-cover w-full h-full" />
                          </AspectRatio>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video URL Section */}
                  <div className="border border-border/20 p-4 bg-black/40 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white tracking-wider font-heading uppercase flex items-center gap-1.5">
                        <Video className="size-3.5 text-accent" /> {t('admin.form.videoTitle')}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder={t('admin.form.videoPlaceholder')}
                        className="bg-black border border-border/40 focus:border-accent outline-none text-white text-xs px-3 py-2.5 rounded-none font-body"
                      />

                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="video/*"
                          id="video-upload"
                          className="hidden"
                          onChange={(e) => handleVideoUpload(e.target.files[0])}
                          disabled={uploadingVideo}
                        />
                        <label
                          htmlFor="video-upload"
                          className="bg-neutral-800 hover:bg-neutral-700 text-white font-heading text-[10px] tracking-widest uppercase py-2 px-3 cursor-pointer select-none transition-colors border border-border/40"
                        >
                          {uploadingVideo ? `${t('admin.form.videoUploading')} (${videoProgress}%)` : t('admin.form.videoUpload')}
                        </label>
                      </div>

                      {uploadingVideo && (
                        <div className="w-full bg-neutral-800 h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-accent h-full transition-all duration-300"
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>
                      )}

                      <span className="text-[10px] text-muted-foreground font-light leading-relaxed">
                        {t('admin.form.videoHint')}
                      </span>

                      {videoUrl && (
                        <div className="mt-2 w-32 border border-border/40 overflow-hidden">
                          <AspectRatio ratio={16/9}>
                            <video src={videoUrl} className="object-cover w-full h-full" muted playsInline controls={false} />
                          </AspectRatio>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-4 border-t border-border/30 pt-6 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelForm}
                  className="rounded-none text-muted-foreground hover:text-white uppercase tracking-widest text-xs"
                >
                  {t('admin.dashboard.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={saving || uploadingThumb || uploadingVideo}
                  className="rounded-none bg-accent hover:bg-accent/80 text-black font-heading font-bold uppercase tracking-widest text-xs px-8 py-5 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> {t('admin.dashboard.saving')}
                    </>
                  ) : (
                    t('admin.dashboard.save')
                  )}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* PROJECT MANAGEMENT TABLE LIST */
          <div className="bg-neutral-900/20 border border-border/40 p-6 animate-fade-up">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="size-8 text-accent animate-spin" />
                <span className="font-heading text-xs tracking-widest text-muted-foreground uppercase">{t('admin.dashboard.loading')}</span>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">
                <p>{error}</p>
                <Button onClick={fetchAdminProjects} className="mt-4 rounded-none bg-neutral-800">{t('admin.dashboard.retry')}</Button>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p>{t('admin.dashboard.empty')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left text-xs uppercase tracking-wider font-heading">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground">
                      <th className="py-4 px-4 font-bold">{t('admin.table.preview')}</th>
                      <th className="py-4 px-4 font-bold">{t('admin.table.title')}</th>
                      <th className="py-4 px-4 font-bold text-center">{t('admin.table.featured')}</th>
                      <th className="py-4 px-4 font-bold text-center">{t('admin.table.order')}</th>
                      <th className="py-4 px-4 font-bold text-right">{t('admin.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 text-white font-body normal-case">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-neutral-900/30 transition-colors">
                        {/* Thumbnail */}
                        <td className="py-4 px-4">
                          <div className="w-20 border border-border/30 overflow-hidden">
                            <AspectRatio ratio={16 / 9}>
                              {proj.thumbnail ? (
                                <img src={proj.thumbnail} alt={proj.title_az} className="object-cover w-full h-full" />
                              ) : (
                                <div className="bg-neutral-800 w-full h-full flex items-center justify-center text-[8px] font-heading text-muted-foreground uppercase">{t('admin.table.no')}</div>
                              )}
                            </AspectRatio>
                          </div>
                        </td>

                        {/* Title */}
                        <td className="py-4 px-4 font-heading font-semibold text-sm">
                          {proj.title_az}
                          <span className="text-[10px] text-muted-foreground block normal-case font-body tracking-normal font-light">slug: {proj.slug}</span>
                        </td>

                        {/* Featured */}
                        <td className="py-4 px-4 text-center">
                          {proj.featured ? (
                            <span className="inline-flex items-center gap-1 text-[9px] bg-accent/15 text-accent border border-accent/20 px-2 py-0.5 font-heading font-bold uppercase tracking-widest">
                              <Sparkles className="size-2.5 fill-accent" /> {t('admin.table.yes')}
                            </span>
                          ) : (
                            <span className="text-[9px] text-neutral-500 uppercase font-heading tracking-widest">{t('admin.table.no')}</span>
                          )}
                        </td>

                        {/* Sort Order */}
                        <td className="py-4 px-4 text-center font-heading font-bold text-accent">
                          {proj.sort_order}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleEditProject(proj)}
                              className="p-2 hover:bg-neutral-800 text-muted-foreground hover:text-white border border-transparent hover:border-border/30 transition-all"
                              title="Edit Project"
                            >
                              <Edit className="size-4" />
                            </button>
                            <button
                              onClick={() => setProjectToDelete(proj)}
                              className="p-2 hover:bg-red-950/40 text-muted-foreground hover:text-red-400 border border-transparent hover:border-red-900/30 transition-all"
                              title="Delete Project"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Custom Confirmation Modal for Deletion */}
        {projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-neutral-950 border border-red-900/40 p-6 md:p-8 flex flex-col gap-6 rounded-none shadow-2xl">
              <div className="flex items-center gap-3 border-b border-red-950/40 pb-4">
                <div className="bg-red-950/40 p-2 border border-red-900/30 text-red-500">
                  <Trash2 className="size-6" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg tracking-wider text-white uppercase leading-none">
                    {t('admin.dashboard.deleteConfirmTitle')}
                  </h3>
                  <p className="text-[9px] text-red-400 font-heading tracking-widest uppercase mt-1">
                    Warning
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left">
                <p className="text-sm font-body text-white font-medium">
                  {t('admin.dashboard.deleteConfirm', { slug: projectToDelete.slug })}
                </p>
                <p className="text-xs font-body text-muted-foreground font-light leading-relaxed normal-case">
                  {t('admin.dashboard.deleteConfirmWarning')}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/20 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-muted-foreground hover:text-white font-heading font-semibold uppercase tracking-wider text-xs border border-border/20 transition-colors cursor-pointer"
                >
                  {t('admin.dashboard.cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(projectToDelete)}
                  className="px-5 py-2.5 bg-red-950/80 hover:bg-red-900 text-white font-heading font-bold uppercase tracking-wider text-xs border border-red-800/40 transition-colors cursor-pointer"
                >
                  {t('admin.dashboard.deleteButton')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
