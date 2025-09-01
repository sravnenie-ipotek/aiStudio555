import { HeroSection } from '@/components/sections/HeroSection';
import { CoursesSection } from '@/components/sections/CoursesSection';
import { DistanceLearning } from '@/components/sections/DistanceLearning';
import { VideoSection } from '@/components/sections/VideoSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { StatisticsSection } from '@/components/sections/StatisticsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Courses Section */}
      <CoursesSection />

      {/* Distance Learning Section */}
      <DistanceLearning />

      {/* Video Section */}
      <VideoSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
