import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Logo } from '@/components/Logo'

export function Navbar() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)
  const location = useLocation()

  const [isLogoIntroActive, setIsLogoIntroActive] = React.useState(false)
  const [isActionsIntroActive, setIsActionsIntroActive] = React.useState(false)

  React.useEffect(() => {
    const isHomepage = location.pathname === '/'
    if (isHomepage && !sessionStorage.getItem('mirkazim_logo_intro')) {
      setIsLogoIntroActive(true)
      setIsActionsIntroActive(true)

      const logoTimer = setTimeout(() => {
        setIsLogoIntroActive(false)
      }, 4400)
      
      const actionsTimer = setTimeout(() => {
        setIsActionsIntroActive(false)
      }, 3800)

      return () => {
        clearTimeout(logoTimer)
        clearTimeout(actionsTimer)
      }
    } else {
      setIsLogoIntroActive(false)
      setIsActionsIntroActive(false)
    }
  }, [location.pathname])

  const changeLanguage = (lng) => {
    if (lng) {
      i18n.changeLanguage(lng)
      localStorage.setItem('lng', lng)
    }
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-border h-16 px-6 md:px-12 flex items-center justify-end">
      {/* Logo */}
      <Link 
        to="/" 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-20 flex items-center justify-center group"
      >
        <Logo 
          className={`w-full h-full ${
            isLogoIntroActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`} 
        />
      </Link>

      {/* Action Items */}
      <div 
        className={`flex items-center gap-6 transition-all duration-1000 ${
          isActionsIntroActive ? 'opacity-0 translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
        }`}
      >
        {/* Language Toggle */}
        <ToggleGroup 
          type="single" 
          value={i18n.language} 
          onValueChange={changeLanguage} 
          size="sm" 
          className="hidden sm:inline-flex border border-border/40 rounded-none bg-black/60"
        >
          <ToggleGroupItem value="az" className="data-[state=on]:bg-accent data-[state=on]:text-white rounded-none px-3 text-xs tracking-widest font-heading font-medium">
            AZ
          </ToggleGroupItem>
          <ToggleGroupItem value="ru" className="data-[state=on]:bg-accent data-[state=on]:text-white rounded-none px-3 text-xs tracking-widest font-heading font-medium">
            RU
          </ToggleGroupItem>
          <ToggleGroupItem value="en" className="data-[state=on]:bg-accent data-[state=on]:text-white rounded-none px-3 text-xs tracking-widest font-heading font-medium">
            EN
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Menu Toggle / Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-accent hover:bg-transparent rounded-none focus-visible:ring-accent"
              aria-label="Toggle Menu"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-full sm:max-w-md bg-black border-l border-border flex flex-col justify-center px-12 sm:px-16"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            
            {/* Menu Label */}
            <div className="text-accent font-heading font-bold tracking-widest text-sm mb-8 uppercase animate-fade-up">
              {t('nav.menu', 'MENU')}
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col gap-8 text-left">
              <Link 
                to="/" 
                hash="about"
                onClick={handleLinkClick}
                className="font-heading font-bold text-4xl sm:text-5xl hover:text-accent transition-colors duration-300 relative group w-fit"
              >
                {t('about.title', 'Haqqımda')}.
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link 
                to="/works" 
                onClick={handleLinkClick}
                className="font-heading font-bold text-4xl sm:text-5xl hover:text-accent transition-colors duration-300 relative group w-fit"
              >
                {t('nav.works')}.
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link 
                to="/" 
                hash="contact"
                onClick={handleLinkClick}
                className="font-heading font-bold text-4xl sm:text-5xl hover:text-accent transition-colors duration-300 relative group w-fit"
              >
                {t('nav.contact')}.
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Language Switcher in Menu (Mobile only) */}
            <div className="mt-8 flex sm:hidden">
              <ToggleGroup 
                type="single" 
                value={i18n.language} 
                onValueChange={changeLanguage} 
                size="sm" 
                className="border border-border/40 rounded-none bg-black/60"
              >
                <ToggleGroupItem value="az" className="data-[state=on]:bg-accent data-[state=on]:text-white rounded-none px-3 text-xs tracking-widest font-heading font-medium">
                  AZ
                </ToggleGroupItem>
                <ToggleGroupItem value="ru" className="data-[state=on]:bg-accent data-[state=on]:text-white rounded-none px-3 text-xs tracking-widest font-heading font-medium">
                  RU
                </ToggleGroupItem>
                <ToggleGroupItem value="en" className="data-[state=on]:bg-accent data-[state=on]:text-white rounded-none px-3 text-xs tracking-widest font-heading font-medium">
                  EN
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Extra footer in Menu */}
            <div className="mt-16 border-t border-border pt-8 text-muted-foreground text-xs tracking-widest uppercase font-heading">
              MIRKAZIM MEDIA &copy; 2026
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
