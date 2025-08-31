/**
 * Example page demonstrating all Projectdes Academy components
 * This file shows how to use all the components together in a real page
 */

"use client"

import React from 'react'
import { 
  Header, 
  HeroSection, 
  FeaturesSection, 
  CoursesSection, 
  Footer,
  Button 
} from '@/components'
import type { Language } from '@/components'

export default function ExamplePage() {
  const [currentLanguage, setCurrentLanguage] = React.useState<string>('ru')

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language.code)
    // Here you would typically:
    // 1. Update your i18n system
    // 2. Store preference in localStorage/cookies
    // 3. Update URL or routing if needed
    console.log(`Language changed to: ${language.code} (${language.nativeName})`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Navigation */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        transparent={true}
        fixed={true}
      />

      <main>
        {/* Hero Section */}
        <HeroSection
          variant="default"
          className="pt-16" // Account for fixed header
        />

        {/* Features Section */}
        <FeaturesSection
          variant="alternating"
          title="Why Choose Projectdes Academy?"
          subtitle="Transform your career with the most comprehensive AI training program designed for working professionals"
          showCTA={true}
        />

        {/* Courses Section */}
        <CoursesSection
          variant="grid"
          showFilters={true}
          title="Our AI Transformation Courses"
          subtitle="Master practical AI skills with our industry-leading curriculum"
          maxCourses={3}
        />

        {/* Additional Content Example */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-8">
              Ready to Start Your AI Journey?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="primary">
                Explore All Courses
              </Button>
              <Button size="xl" variant="outline">
                Book Free Consultation
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

/**
 * Usage Examples for Individual Components:
 * 
 * 1. Button Component:
 * <Button variant="primary" size="lg" loading={isLoading}>
 *   Click me
 * </Button>
 * 
 * 2. Language Switcher:
 * <LanguageSwitcher
 *   currentLanguage="ru"
 *   onLanguageChange={(lang) => console.log(lang)}
 *   variant="minimal"
 * />
 * 
 * 3. Hero Section:
 * <HeroSection
 *   variant="video"
 *   backgroundImage="/hero-bg.jpg"
 * />
 * 
 * 4. Features Section:
 * <FeaturesSection
 *   variant="grid"
 *   showCTA={false}
 *   title="Custom Features Title"
 * />
 * 
 * 5. Courses Section:
 * <CoursesSection
 *   variant="carousel"
 *   maxCourses={6}
 *   showFilters={true}
 * />
 */