'use client';

import * as React from 'react';
import {
  Zap,
  Target,
  Award,
  Users,
  Clock,
  Globe,
  BookOpen,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Headphones,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  details?: string[]
  highlight?: boolean
}

export interface FeaturesProps {
  className?: string
  variant?: 'default' | 'grid' | 'list' | 'alternating'
  showCTA?: boolean
  title?: string
  subtitle?: string
}

const mainFeatures: Feature[] = [
  {
    icon: Target,
    title: 'Project-Based Learning',
    description: "Learn by building real AI solutions that solve actual business problems. No theoretical fluff - just practical skills you'll use immediately.",
    details: [
      'Build 5+ real-world projects',
      'Work with actual client requirements',
      'Create portfolio-ready solutions',
      'Get feedback from industry experts',
    ],
    highlight: true,
  },
  {
    icon: Award,
    title: 'Guaranteed Job Placement',
    description: "98% of our graduates land AI roles within 6 months. We're so confident, we offer a money-back guarantee if you don't get hired.",
    details: [
      'Resume and LinkedIn optimization',
      'Interview preparation and practice',
      'Direct connections to hiring partners',
      'Salary negotiation support',
    ],
    highlight: true,
  },
  {
    icon: Users,
    title: 'Expert Mentorship',
    description: 'Learn directly from AI professionals working at top companies like Google, Microsoft, and Meta. Get personalized guidance throughout your journey.',
    details: [
      '1-on-1 mentorship sessions',
      'Industry insider insights',
      'Career path guidance',
      'Network building opportunities',
    ],
  },
  {
    icon: Clock,
    title: 'Fast-Track Program',
    description: 'Transform your career in just 3-6 months with our intensive, accelerated curriculum. Study part-time while keeping your current job.',
    details: [
      'Flexible evening and weekend classes',
      'Self-paced online modules',
      'Recorded sessions for review',
      'Mobile-friendly platform',
    ],
  },
  {
    icon: Globe,
    title: 'Global Opportunities',
    description: 'Access job opportunities in 20+ countries. Our network spans across US, Europe, Asia, and Middle East markets.',
    details: [
      'International job placement',
      'Visa sponsorship assistance',
      'Cultural adaptation support',
      'Global alumni network',
    ],
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Curriculum',
    description: 'Master everything from AI fundamentals to advanced implementation. Our curriculum is updated monthly based on industry trends.',
    details: [
      'Latest AI tools and frameworks',
      'Hands-on lab exercises',
      'Industry case studies',
      'Certification preparation',
    ],
  },
];

const additionalFeatures: Feature[] = [
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Get help whenever you need it with our round-the-clock support system.',
  },
  {
    icon: Shield,
    title: 'Lifetime Access',
    description: 'Keep learning with lifetime access to all course materials and updates.',
  },
  {
    icon: TrendingUp,
    title: 'Salary Increase',
    description: 'Average 127% salary increase within first year of graduation.',
  },
  {
    icon: Briefcase,
    title: 'Industry Partners',
    description: 'Direct hiring partnerships with 500+ companies worldwide.',
  },
];

const FeaturesSection = React.forwardRef<HTMLElement, FeaturesProps>(
  ({
    className,
    variant = 'default',
    showCTA = true,
    title = 'Why Choose Projectdes Academy?',
    subtitle = 'Transform your career with the most comprehensive AI training program designed for working professionals',
    ...props
  }, ref) => {
    const renderFeatureCard = (feature: Feature, index: number, isMain = true) => (
      <div
        key={feature.title}
        className={cn(
          'group relative bg-white rounded-2xl p-6 lg:p-8 shadow-card hover:shadow-xl transition-all duration-300',
          'border border-border-light hover:border-primary-yellow/20',
          'hover:-translate-y-1',
          feature.highlight && 'ring-2 ring-primary-yellow/20',
          isMain ? 'h-full' : 'h-auto',
        )}
      >
        {feature.highlight && (
          <div className="absolute -top-3 left-6">
            <span className="bg-primary-yellow text-dark-pure text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </span>
          </div>
        )}

        <div className="flex items-start space-x-4">
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300',
            feature.highlight
              ? 'bg-primary-yellow text-dark-pure'
              : 'bg-primary-yellow/10 text-primary-yellow group-hover:bg-primary-yellow group-hover:text-dark-pure',
          )}>
            <feature.icon className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary-yellow transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-text-gray leading-relaxed mb-4">
              {feature.description}
            </p>

            {feature.details && isMain && (
              <ul className="space-y-2" role="list">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start space-x-2 text-sm text-text-gray">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );

    const renderGridLayout = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {mainFeatures.map((feature, index) => renderFeatureCard(feature, index))}
      </div>
    );

    const renderAlternatingLayout = () => (
      <div className="space-y-16 lg:space-y-24">
        {mainFeatures.map((feature, index) => (
          <div
            key={feature.title}
            className={cn(
              'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center',
              index % 2 === 1 && 'lg:grid-flow-col-dense',
            )}
          >
            <div className={cn(
              'space-y-6',
              index % 2 === 1 && 'lg:col-start-2',
            )}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary-yellow text-dark-pure flex items-center justify-center">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-text-primary">
                  {feature.title}
                </h3>
              </div>

              <p className="text-lg text-text-gray leading-relaxed">
                {feature.description}
              </p>

              {feature.details && (
                <ul className="space-y-3" role="list">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-1" aria-hidden="true" />
                      <span className="text-text-gray">{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={cn(
              'relative',
              index % 2 === 1 && 'lg:col-start-1 lg:row-start-1',
            )}>
              <div className="aspect-square bg-gradient-to-br from-primary-yellow/10 via-accent-blue/10 to-primary-yellow/20 rounded-2xl flex items-center justify-center shadow-lg">
                <feature.icon className="h-24 w-24 lg:h-32 lg:w-32 text-primary-yellow" />
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-success text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                ✓ Proven Results
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <section
        ref={ref}
        className={cn(
          'py-16 lg:py-24 bg-gradient-to-b from-white to-light-bg font-rubik',
          className,
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              {title}
            </h2>
            <p className="text-lg lg:text-xl text-text-gray leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Features Content */}
          {variant === 'alternating' ? renderAlternatingLayout() : renderGridLayout()}

          {/* Additional Features */}
          <div className="mt-16 lg:mt-20">
            <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
              Plus, you get all these benefits included:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => renderFeatureCard(feature, index, false))}
            </div>
          </div>

          {/* CTA Section */}
          {showCTA && (
            <div className="mt-16 lg:mt-20 text-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto border border-border-light">
                <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
                  Ready to Transform Your Career?
                </h3>
                <p className="text-lg text-text-gray mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals who've successfully made the transition to high-paying AI roles.
                  Your future in AI starts today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button size="xl" asChild>
                    <a href="/courses" className="inline-flex items-center">
                      Explore Our Courses
                      <TrendingUp className="ml-2 h-5 w-5" />
                    </a>
                  </Button>

                  <Button variant="outline" size="xl" asChild>
                    <a href="/contact">
                      Schedule Free Consultation
                    </a>
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-text-gray">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Money-back guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-success" />
                    <span>5,000+ successful graduates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-success" />
                    <span>98% job placement rate</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  },
);

FeaturesSection.displayName = 'FeaturesSection';

export { FeaturesSection, mainFeatures, additionalFeatures };
