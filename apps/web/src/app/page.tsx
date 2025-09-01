import { HeroSection } from '@/components/sections/HeroSection';
import { CoursesSection } from '@/components/sections/CoursesSection';
import { DistanceLearning } from '@/components/sections/DistanceLearning';
import { VideoSection } from '@/components/sections/VideoSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection, type FAQItem } from '@aistudio555/ui';
import { CTASection } from '@/components/sections/CTASection';

const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Как записаться на курс AI Transformation Manager?',
    answer: 'Для записи на курс вы можете воспользоваться формой регистрации на нашем сайте или связаться с нашими консультантами. Мы предлагаем гибкие варианты оплаты, включая рассрочку.',
    category: 'enrollment',
    popular: true,
    readTime: 2,
    lastUpdated: 'вчера',
    tags: ['запись', 'регистрация', 'AI'],
  },
  {
    id: 'faq-2',
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем оплату банковскими картами, банковскими переводами, через электронные кошельки. Также доступна рассрочка на 3, 6 и 12 месяцев.',
    category: 'payment',
    popular: true,
    readTime: 1,
    lastUpdated: '2 дня назад',
    tags: ['оплата', 'рассрочка'],
  },
  {
    id: 'faq-3',
    question: 'Получу ли я сертификат после завершения курса?',
    answer: 'Да, после успешного завершения курса вы получите сертификат, признанный международными компаниями. Сертификат выдается в электронном виде с возможностью печати.',
    category: 'certification',
    popular: true,
    readTime: 1,
    lastUpdated: 'неделю назад',
    tags: ['сертификат', 'завершение'],
  },
  {
    id: 'faq-4',
    question: 'Сколько времени занимает изучение курса?',
    answer: 'Продолжительность курса зависит от выбранной программы. В среднем курсы длятся от 3 до 6 месяцев при изучении 10-15 часов в неделю.',
    category: 'courses',
    readTime: 1,
    lastUpdated: 'неделю назад',
    tags: ['время', 'длительность'],
  },
  {
    id: 'faq-5',
    question: 'Есть ли техническая поддержка?',
    answer: 'Да, наша команда технической поддержки доступна 24/7 через чат, электронную почту и телефон. Мы также предоставляем персональных наставников.',
    category: 'technical',
    readTime: 1,
    lastUpdated: '3 дня назад',
    tags: ['поддержка', 'наставники'],
  },
  {
    id: 'faq-6',
    question: 'Можно ли изучать курс в своем темпе?',
    answer: 'Конечно! Наша платформа позволяет изучать материал в удобном для вас темпе. Доступ к материалам сохраняется на весь период обучения.',
    category: 'courses',
    readTime: 1,
    lastUpdated: '5 дней назад',
    tags: ['темп', 'гибкость'],
  },
  {
    id: 'faq-7',
    question: 'Предоставляете ли вы помощь в трудоустройстве?',
    answer: 'Да, мы предоставляем гарантию трудоустройства в течение 6 месяцев после окончания курса. Наша команда карьерных консультантов поможет в поиске работы.',
    category: 'general',
    readTime: 2,
    lastUpdated: 'неделю назад',
    tags: ['трудоустройство', 'карьера'],
  },
  {
    id: 'faq-8',
    question: 'Нужна ли предварительная подготовка?',
    answer: 'Нет, наши курсы разработаны для начинающих. Мы начинаем с основ и постепенно переходим к более сложным темам.',
    category: 'general',
    readTime: 1,
    lastUpdated: '4 дня назад',
    tags: ['подготовка', 'начинающие'],
  },
];

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
      <FAQSection 
        faqs={faqData}
        title="Часто задаваемые вопросы"
        subtitle="Найдите ответы на самые популярные вопросы о наших курсах"
        showSearch={true}
        showCategories={true}
        showPopularQuestions={true}
        showCTA={true}
        ctaProps={{
          title: 'Остались вопросы?',
          subtitle: 'Получите персональную консультацию',
          consultationText: 'Задать вопрос',
          coursesText: 'Все курсы',
          consultationUrl: '/consultation',
          coursesUrl: '/courses',
          showStats: true,
          stats: [
            { value: '500+', label: 'Отвеченных вопросов', color: 'primary' },
            { value: '<24ч', label: 'Время ответа', color: 'success' },
            { value: '98%', label: 'Довольных клиентов', color: 'info' },
          ]
        }}
      />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
