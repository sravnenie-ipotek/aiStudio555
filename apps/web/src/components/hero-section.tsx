'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HeroProps {
  className?: string
  backgroundImage?: string
  variant?: 'default' | 'video' | 'minimal'
}

const stats = [
  { icon: Users, value: '5,000+', label: 'Students Transformed' },
  { icon: Award, value: '98%', label: 'Job Placement Rate' },
  { icon: TrendingUp, value: '$75K+', label: 'Average Salary Increase' },
  { icon: Star, value: '4.9/5', label: 'Student Rating' },
];

const trustedLogos = [
  { name: 'Microsoft', src: '/logos/microsoft.svg' },
  { name: 'Google', src: '/logos/google.svg' },
  { name: 'Amazon', src: '/logos/amazon.svg' },
  { name: 'Meta', src: '/logos/meta.svg' },
  { name: 'Apple', src: '/logos/apple.svg' },
];

const HeroSection = React.forwardRef<HTMLElement, HeroProps>(
  ({ className, backgroundImage, variant = 'default', ...props }, ref) => {
    const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);

    const handleVideoPlay = () => {
      setIsVideoPlaying(true);
      // Here you would typically open a video modal or navigate to a video page
      console.log('Play introduction video');
    };

    const heroContent = (
      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Announcement Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-yellow/10 border border-primary-yellow/20 text-primary-yellow text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4 mr-2" aria-hidden="true" />
              <span>New: AI Video Generation Course Available</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary mb-6 leading-tight">
              Transform Your Career with{' '}
              <span className="text-primary-yellow relative">
                Practical AI Skills
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary-yellow/30"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 10c49.7-2.7 99.3-4 149-4s99.3 1.3 149 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-text-gray mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Join 5,000+ professionals who've successfully transitioned into high-paying AI roles.
              Get hands-on experience with real projects and guaranteed job placement.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
              <Button
                asChild
                size="xl"
                className="group"
              >
                <Link href="/courses">
                  Start Your AI Journey
                  <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="xl"
                onClick={handleVideoPlay}
                className="group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                Watch Success Stories
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start mb-2">
                      <div className="bg-primary-yellow/10 p-2 rounded-lg">
                        <stat.icon className="h-5 w-5 text-primary-yellow" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-text-gray">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trusted by */}
              <div>
                <p className="text-text-gray text-sm mb-4 text-center lg:text-left">
                  Our graduates now work at:
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
                  {trustedLogos.map((logo, index) => (
                    <div key={index} className="h-6 lg:h-8">
                      {/* Placeholder for company logos - replace with actual images */}
                      <div className="h-full bg-text-gray/20 rounded px-4 flex items-center">
                        <span className="text-xs font-medium text-text-gray">
                          {logo.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            {variant === 'video' ? (
              // Video Preview
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-yellow/20 to-accent-blue/20 flex items-center justify-center">
                  <Button
                    onClick={handleVideoPlay}
                    size="icon"
                    className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-white/90 hover:bg-white text-primary-yellow hover:text-primary-yellow shadow-lg hover:scale-110 transition-all duration-300"
                    aria-label="Play introduction video"
                  >
                    <Play className="h-8 w-8 lg:h-10 lg:w-10 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                  <div className="flex items-center justify-between">
                    <span>See how Sarah became an AI Manager</span>
                    <span>2:47</span>
                  </div>
                </div>
              </div>
            ) : (
              // Hero Image/Illustration
              <div className="relative">
                <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  {backgroundImage ? (
                    <Image
                      src={backgroundImage}
                      alt="AI Transformation Success"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    // Placeholder illustration
                    <div className="w-full h-full bg-gradient-to-br from-primary-yellow/10 via-accent-blue/10 to-primary-yellow/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-primary-yellow/20 p-8 rounded-full mb-4 inline-block">
                          <TrendingUp className="h-16 w-16 text-primary-yellow" />
                        </div>
                        <p className="text-text-gray font-medium">
                          AI Career Transformation
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-success text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg">
                  98% Success Rate
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white shadow-lg rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-yellow to-accent-blue border-2 border-white"
                        />
                      ))}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-text-primary">5,000+</div>
                      <div className="text-text-gray">Graduates</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    if (variant === 'minimal') {
      return (
        <section
          ref={ref}
          className={cn('py-20 bg-white', className)}
          {...props}
        >
          {heroContent}
        </section>
      );
    }

    return (
      <section
        ref={ref}
        className={cn(
          'relative min-h-screen flex items-center bg-gradient-to-br from-light-bg via-white to-primary-yellow/5',
          'overflow-hidden font-rubik',
          className,
        )}
        {...props}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(255,218,23,0.1)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(94,160,255,0.1)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(255,218,23,0.05)_0%,_transparent_50%)]" />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {heroContent}
      </section>
    );
  },
);

HeroSection.displayName = 'HeroSection';

export { HeroSection };
export { stats, trustedLogos };
