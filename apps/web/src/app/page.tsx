import { HeroSection } from '@/components/sections/HeroSection';
import { CoursesSection } from '@/components/sections/CoursesSection';
import { DistanceLearning } from '@/components/sections/DistanceLearning';
import { VideoSection } from '@/components/sections/VideoSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTASection } from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

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

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
