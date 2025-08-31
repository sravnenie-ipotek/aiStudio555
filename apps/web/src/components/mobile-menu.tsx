"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Menu, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher, type Language } from "@/components/language-switcher"
import { cn } from "@/lib/utils"

export interface NavigationItem {
  label: string
  href: string
  subItems?: NavigationItem[]
  external?: boolean
}

export interface MobileMenuProps {
  navigation: NavigationItem[]
  currentPath?: string
  currentLanguage?: string
  onLanguageChange?: (language: Language) => void
  className?: string
  logoSrc?: string
  logoAlt?: string
}

const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(
  ({
    navigation,
    currentPath = "",
    currentLanguage = "ru",
    onLanguageChange,
    className,
    logoSrc,
    logoAlt = "Projectdes Academy",
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

    const toggleExpansion = (label: string) => {
      setExpandedItems(prev => {
        const newSet = new Set(prev)
        if (newSet.has(label)) {
          newSet.delete(label)
        } else {
          newSet.add(label)
        }
        return newSet
      })
    }

    const handleNavigation = (href: string, external?: boolean) => {
      if (external) {
        window.open(href, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = href
      }
      setIsOpen(false)
    }

    // Close menu on escape key
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          setIsOpen(false)
        }
      }
      
      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
      const hasSubItems = item.subItems && item.subItems.length > 0
      const isExpanded = expandedItems.has(item.label)
      const isActive = currentPath === item.href

      return (
        <div key={item.label} className="w-full">
          <div className="flex items-center w-full">
            <button
              onClick={() => hasSubItems ? toggleExpansion(item.label) : handleNavigation(item.href, item.external)}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 text-left transition-colors duration-200",
                "hover:bg-surface-light focus:bg-surface-light focus:outline-none",
                "min-h-[44px] font-rubik",
                isActive && "bg-primary-yellow text-dark-pure font-semibold",
                level > 0 && "pl-8 text-sm"
              )}
              style={{ paddingLeft: `${16 + level * 16}px` }}
              aria-expanded={hasSubItems ? isExpanded : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="flex-1">{item.label}</span>
              {item.external && (
                <svg 
                  className="h-4 w-4 ml-2 text-text-gray" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
              {hasSubItems && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 text-text-gray",
                    isExpanded && "transform rotate-90"
                  )}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
          {hasSubItems && isExpanded && (
            <div className="border-l border-border-light ml-4">
              {item.subItems!.map((subItem) => 
                renderNavigationItem(subItem, level + 1)
              )}
            </div>
          )}
        </div>
      )
    }

    return (
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button
            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 tap-target text-text-primary hover:bg-surface-light h-11 w-11 md:hidden relative z-40"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </Dialog.Trigger>
        
        <Dialog.Portal>
          <Dialog.Overlay 
            className={cn(
              "fixed inset-0 z-modal-backdrop bg-dark-pure/80 backdrop-blur-sm",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            )}
          />
          <Dialog.Content
            ref={ref}
            className={cn(
              "fixed left-0 top-0 z-modal h-full w-full max-w-sm bg-white shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
              "data-[state=open]:duration-300 data-[state=closed]:duration-200",
              className
            )}
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-light">
              <div className="flex items-center">
                {logoSrc ? (
                  <img 
                    src={logoSrc} 
                    alt={logoAlt}
                    className="h-8 w-auto"
                  />
                ) : (
                  <span className="text-lg font-bold text-primary-yellow">
                    Projectdes Academy
                  </span>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 tap-target text-text-primary hover:bg-surface-light h-8 w-8"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            {/* Navigation */}
            <nav 
              className="flex-1 overflow-y-auto py-4" 
              role="navigation" 
              aria-label="Mobile navigation"
            >
              <div className="space-y-1">
                {navigation.map((item) => renderNavigationItem(item))}
              </div>
            </nav>

            {/* Footer with Language Switcher */}
            <div className="border-t border-border-light p-4 space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium text-text-gray">
                  Language
                </span>
                <LanguageSwitcher
                  currentLanguage={currentLanguage}
                  onLanguageChange={onLanguageChange}
                  variant="mobile"
                  showNativeName={true}
                />
              </div>
              
              {/* Contact Button */}
              <Button 
                className="w-full" 
                onClick={() => handleNavigation('/contact')}
              >
                Get Started Today
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
)

MobileMenu.displayName = "MobileMenu"

export { MobileMenu }