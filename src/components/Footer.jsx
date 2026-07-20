import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-black py-12 px-6 md:px-12 border-t border-border/40 flex items-center justify-center">
      {/* Copyright */}
      <div className="font-heading font-medium text-xs text-muted-foreground tracking-widest uppercase text-center">
        MIRKAZIM MEDIA &copy; {new Date().getFullYear()}
      </div>
    </footer>
  )
}
