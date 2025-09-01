'use client';

import { useTranslation } from '@/hooks/useTranslation';

export function VideoSection() {
  const { tSync } = useTranslation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-8 lg:mb-12">
          {tSync('videoSection.title') || 'Есть ли жизнь после IT-курсов?'}
        </h2>

        {/* Video Container */}
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl"
              src={tSync('videoSection.videoUrl') || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title={tSync('videoSection.videoTitle') || 'Видео о жизни после IT-курсов'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Optional Description */}
        <div className="max-w-3xl mx-auto mt-8 text-center">
          <p className="text-lg text-gray-600 leading-relaxed">
            {tSync('videoSection.description') ||
              'Узнайте, как наши выпускники строят успешную карьеру в IT и достигают своих целей после обучения'}
          </p>
        </div>
      </div>
    </section>
  );
}
