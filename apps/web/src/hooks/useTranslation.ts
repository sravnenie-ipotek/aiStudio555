/**
 * Enhanced Translation Hook for AiStudio555 Academy
 * =================================================
 * 
 * Integrates with Strapi CMS for dynamic translations
 * Fallback support for hardcoded translations
 * Session-based language management
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { strapiClient, type TranslationEntry } from '@/lib/strapi-client';
import { languageManager, type SupportedLanguage } from '@/lib/language-manager';

type Language = SupportedLanguage;

interface TranslationCache {
  [key: string]: {
    [language in Language]?: string;
  };
}

// Fallback translations for critical UI elements when Strapi is unavailable
const fallbackTranslations: Record<Language, Record<string, string>> = {
  ru: {
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.close': 'Закрыть',
    'common.cancel': 'Отмена',
    'common.language': 'Язык',
    
    // Navigation
    'nav.courses': 'Курсы',
    'nav.monthlyStarts': 'Старты месяца',
    'nav.instructors': 'Преподаватели',
    'nav.blog': 'Блог',
    'nav.aboutSchool': 'О школе',
    'nav.enrollNow': 'Записаться сейчас',
    'nav.aiManager': 'AI Transformation Manager',
    'nav.noCode': 'No-Code разработка',
    'nav.aiVideo': 'AI видео генерация',
    'nav.allCourses': 'Все курсы',
    'nav.aboutUs': 'О нас',
    'nav.contacts': 'Контакты',
    'nav.careerCenter': 'Карьерный центр',
    'nav.profOrientation': 'Профориентация',
    
    // Hero Section
    'hero.title': 'AI-трансформация для разработчиков и бизнеса',
    'hero.subtitle': 'Персональное менторство, практические курсы и стратегии роста для next-level карьеры',
    'hero.badge': 'Старт нового потока 1 февраля',
    'hero.cta.primary': 'Начать обучение',
    'hero.cta.secondary': 'Бесплатная консультация',
    'hero.stats.students': '12,000+ выпускников',
    'hero.stats.employment': '87% трудоустройство',
    'hero.stats.courses': '25+ курсов',
    
    // Courses Section
    'courses.title': 'Наши флагманские курсы',
    'courses.subtitle': 'Выберите свой путь в мир искусственного интеллекта',
    'courses.viewAll': 'Все курсы',
    'courses.cta': 'Подробнее',
    
    // Courses Hero Section
    'courses.hero.graduates': 'выпускников',
    'courses.hero.years': 'лет опыта',
    'courses.hero.title': 'AI-Курсы Online',
    'courses.hero.subtitle': 'для карьерного роста',
    'courses.hero.description': 'Персональное менторство, практические проекты и гарантированное трудоустройство в AI-сфере',
    'courses.hero.cta.primary': 'Выбрать курс',
    'courses.hero.cta.secondary': 'Бесплатная консультация',
    'courses.hero.metrics.employment': 'трудоустройство',
    'courses.hero.metrics.salary': 'рост зарплаты',
    'courses.hero.metrics.certificate': 'сертификат',
    'courses.hero.metrics.flexible': 'гибкий график',
    'courses.hero.trust.secure': 'Безопасная оплата',
    'courses.hero.trust.rating': '4.8 из 5 звёзд',
    'courses.hero.trust.support': '24/7 поддержка',
    
    // Course Cards
    'courses.card.popular': 'Популярный',
    'courses.card.careers': 'Кем станешь:',
    'courses.card.skills': 'Изучите:',
    'courses.card.installments': 'рассрочка',
    'courses.card.cta.primary': 'Подробнее о курсе',
    'courses.card.cta.secondary': 'Консультация',
    
    // Course Catalog
    'courses.catalog.title': 'Выберите свой путь в AI',
    'courses.catalog.subtitle': 'Практические курсы от ведущих экспертов индустрии с гарантированным трудоустройством',
    'courses.catalog.search.placeholder': 'Поиск курсов по названию, навыкам или профессии...',
    'courses.catalog.filters.all': 'Все курсы',
    'courses.catalog.filters.level': 'Уровень:',
    'courses.catalog.filters.allLevels': 'Все уровни',
    'courses.catalog.filters.beginner': 'Начинающий',
    'courses.catalog.filters.intermediate': 'Средний',
    'courses.catalog.filters.advanced': 'Продвинутый',
    'courses.catalog.sort.popularity': 'По популярности',
    'courses.catalog.sort.priceLow': 'Цена: по возрастанию',
    'courses.catalog.sort.priceHigh': 'Цена: по убыванию',
    'courses.catalog.sort.rating': 'По рейтингу',
    'courses.catalog.sort.newest': 'Новые курсы',
    'courses.catalog.activeFilters': 'Активные фильтры:',
    'courses.catalog.clearFilters': 'Сбросить все',
    'courses.catalog.found': 'Найдено',
    'courses.catalog.coursesCount': 'курсов',
    'courses.catalog.loadMore': 'Показать еще курсы',
    'courses.catalog.empty.title': 'Курсы не найдены',
    'courses.catalog.empty.description': 'Попробуйте изменить параметры поиска или выбрать другую категорию',
    'courses.catalog.empty.reset': 'Сбросить фильтры',
    
    // Consultation Form
    'form.title': 'Получите бесплатную консультацию',
    'form.subtitle.course': 'Узнайте больше о курсе "{course}"',
    'form.subtitle.general': 'Узнайте, какой курс подходит именно вам',
    'form.fields.name.placeholder': 'Ваше имя *',
    'form.fields.phone.placeholder': '+7 (___) ___-__-__ *',
    'form.fields.email.placeholder': 'Email (необязательно)',
    'form.fields.preferredTime.label': 'Удобное время для звонка:',
    'form.fields.preferredTime.any': 'Любое время',
    'form.fields.preferredTime.morning': 'Утром (9:00-12:00)',
    'form.fields.preferredTime.afternoon': 'Днём (12:00-17:00)',
    'form.fields.preferredTime.evening': 'Вечером (17:00-20:00)',
    'form.trust.secure': 'Конфиденциально',
    'form.trust.fast': 'Ответим за 15 минут',
    'form.button.submit': 'Получить консультацию бесплатно',
    'form.button.sending': 'Отправляем...',
    'form.success.title': 'Заявка отправлена!',
    'form.success.message': 'Мы свяжемся с вами в течение 15 минут',
    'form.error.message': 'Произошла ошибка. Попробуйте еще раз или позвоните нам',
    'form.error.phone': 'Телефон: +7 (495) 123-45-67',
    'form.benefits.title': 'Что вы получите:',
    'form.benefits.consultation': 'Персональную консультацию по выбору курса',
    'form.benefits.program': 'Подробную программу обучения',
    'form.benefits.career': 'План развития карьеры в AI',
    'form.benefits.discount': 'Специальное предложение со скидкой',
    'form.validation.nameRequired': 'Имя обязательно',
    'form.validation.phoneRequired': 'Телефон обязателен',
    'form.validation.phoneInvalid': 'Неверный формат телефона',
    'form.validation.emailInvalid': 'Неверный email',
    
    // Benefits Section
    'benefits.title': 'Почему выбирают AIStudio555',
    'benefits.subtitle': 'Мы создали идеальную среду для вашего обучения и карьерного роста',
    
    // Testimonials Section
    'testimonials.title': 'Отзывы наших выпускников',
    'testimonials.subtitle': 'Истории успеха тех, кто уже изменил свою жизнь',
    
    // CTA Section
    'cta.title': 'Готовы начать карьеру в IT?',
    'cta.subtitle': 'Присоединяйтесь к тысячам выпускников AIStudio555, которые уже работают в ведущих IT-компаниях мира',
    'cta.button.primary': 'Выбрать курс',
    'cta.button.secondary': 'Получить консультацию',
    'cta.badge': '🔒 Безопасная оплата • 💳 Рассрочка от 3 месяцев • 📚 Доступ навсегда',
    
    // Distance Learning Section
    'distanceLearning.title': 'О дистанционном обучении',
    'distanceLearning.description': 'Мифы о дистанционном образовании приказали долго жить еще во времена пандемии. Сегодня сложно найти человека, который бы не верил, что на «дистанте» можно освоить интересную и «дорогую» профессию. Онлайн-обучение вступило в схватку с университетскими парами и ранними подъемами, и теперь берет над всем этим верх.',
    'distanceLearning.cta': 'Узнать больше',
    'distanceLearning.consultation': 'Консультация',
    'distanceLearning.imageAlt': 'Девушка обучается онлайн с ноутбуком',
    
    // Video Section
    'videoSection.title': 'Есть ли жизнь после IT-курсов?',
    'videoSection.videoTitle': 'Видео о жизни после IT-курсов',
    'videoSection.description': 'Узнайте, как наши выпускники строят успешную карьеру в IT и достигают своих целей после обучения',
    'videoSection.videoUrl': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    
    // FAQ Section
    'faq.title': 'Часто задаваемые вопросы',
    'faq.subtitle': 'Найдите ответы на самые популярные вопросы о наших курсах',
    
    'faq.question1': 'Смогу ли я пойти на обучающие курсы, если у меня нет никакой базы?',
    'faq.answer1': 'Конечно! Наши курсы разработаны специально для начинающих. Мы начинаем с основ и постепенно переходим к более сложным темам. Наши преподаватели имеют большой опыт работы с новичками и помогут вам освоить материал независимо от вашего стартового уровня.',
    
    'faq.question2': 'Есть ли у вас возрастные ограничения для обучающихся?',
    'faq.answer2': 'У нас нет возрастных ограничений! Мы приветствуем студентов всех возрастов - от недавних выпускников до профессионалов, желающих сменить карьеру. AI-трансформация доступна каждому, кто готов учиться и развиваться.',
    
    'faq.question3': 'Как определиться с выбором направления?',
    'faq.answer3': 'Мы предлагаем бесплатную консультацию по профориентации! Наши специалисты помогут вам выбрать между AI Transformation Manager, No-Code разработкой или AI Video & Avatar Generation на основе ваших интересов, целей и текущего опыта.',
    
    'faq.question4': 'После прохождения курса предоставляете помощь с трудоустройством?',
    'faq.answer4': 'Да! Мы предоставляем гарантию трудоустройства в 5+ странах мира. Наш карьерный центр поможет с составлением резюме, подготовкой к собеседованиям и поиском подходящих вакансий. 87% наших выпускников успешно трудоустраиваются.',
    
    'faq.question5': 'Какова стоимость курса и какие варианты оплаты у вас доступны?',
    'faq.answer5': 'Стоимость наших курсов составляет от $1,000 до $1,500. Мы предлагаем удобную рассрочку от 3 месяцев, безопасные платежи через Stripe и PayPal. Также доступны скидки для студентов и групповые тарифы.',
    
    'faq.question6': 'Выдает ли школа сертификат после курсов?',
    'faq.answer6': 'Да! После успешного завершения курса вы получите сертификат AIStudio555, который признается работодателями в IT-индустрии. Сертификат подтверждает ваши знания и навыки в выбранной специализации.',
    
    'faq.question7': 'Какие форматы обучения доступны?',
    'faq.answer7': 'Мы предлагаем онлайн и гибридные форматы обучения. Вы можете учиться полностью дистанционно с персональным ментором или выбрать комбинированный подход с очными мастер-классами. Все материалы доступны 24/7.',
    
    'faq.question8': 'Достаточно ли знаний я получу после курсов, чтобы начать карьеру в IT?',
    'faq.answer8': 'Абсолютно! Наши курсы построены на практических проектах и реальных кейсах. За 3-6 месяцев вы получите все необходимые навыки для работы Junior специалистом. Более 12,000 наших выпускников уже работают в ведущих IT-компаниях мира.',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.language': 'Language',
    
    // Navigation
    'nav.courses': 'Courses',
    'nav.monthlyStarts': 'Monthly Starts',
    'nav.instructors': 'Teachers',
    'nav.blog': 'Blog',
    'nav.aboutSchool': 'About School',
    'nav.enrollNow': 'Enroll Now',
    'nav.aiManager': 'AI Transformation Manager',
    'nav.noCode': 'No-Code Development',
    'nav.aiVideo': 'AI Video Generation',
    'nav.allCourses': 'All Courses',
    'nav.aboutUs': 'About Us',
    'nav.contacts': 'Contacts',
    'nav.careerCenter': 'Career Center',
    'nav.profOrientation': 'Career Guidance',
    
    // Hero Section
    'hero.title': 'Become an AI Specialist in 3-6 Months',
    'hero.subtitle': 'Practical courses for AI transformation with job placement guarantee in 5 countries',
    'hero.badge': 'New cohort starts February 1st',
    'hero.cta.primary': 'Start Learning',
    'hero.cta.secondary': 'Free Consultation',
    'hero.stats.students': '12,000+ graduates',
    'hero.stats.employment': '87% employment rate',
    'hero.stats.courses': '25+ courses',
    
    // Courses Section
    'courses.title': 'Our Flagship Courses',
    'courses.subtitle': 'Choose your path into the world of artificial intelligence',
    'courses.viewAll': 'View All Courses',
    'courses.cta': 'Learn More',
    
    // Courses Hero Section
    'courses.hero.graduates': 'graduates',
    'courses.hero.years': 'years of experience',
    'courses.hero.title': 'AI Courses Online',
    'courses.hero.subtitle': 'for career growth',
    'courses.hero.description': 'Personal mentorship, practical projects and guaranteed job placement in the AI field',
    'courses.hero.cta.primary': 'Choose Course',
    'courses.hero.cta.secondary': 'Free Consultation',
    'courses.hero.metrics.employment': 'employment',
    'courses.hero.metrics.salary': 'salary increase',
    'courses.hero.metrics.certificate': 'certificate',
    'courses.hero.metrics.flexible': 'flexible schedule',
    'courses.hero.trust.secure': 'Secure Payment',
    'courses.hero.trust.rating': '4.8 out of 5 stars',
    'courses.hero.trust.support': '24/7 support',
    
    // Course Cards
    'courses.card.popular': 'Popular',
    'courses.card.careers': 'You will become:',
    'courses.card.skills': 'You will learn:',
    'courses.card.installments': 'installments',
    'courses.card.cta.primary': 'Learn More About Course',
    'courses.card.cta.secondary': 'Consultation',
    
    // Course Catalog
    'courses.catalog.title': 'Choose Your Path in AI',
    'courses.catalog.subtitle': 'Practical courses from leading industry experts with guaranteed job placement',
    'courses.catalog.search.placeholder': 'Search courses by title, skills or profession...',
    'courses.catalog.filters.all': 'All Courses',
    'courses.catalog.filters.level': 'Level:',
    'courses.catalog.filters.allLevels': 'All Levels',
    'courses.catalog.filters.beginner': 'Beginner',
    'courses.catalog.filters.intermediate': 'Intermediate',
    'courses.catalog.filters.advanced': 'Advanced',
    'courses.catalog.sort.popularity': 'By Popularity',
    'courses.catalog.sort.priceLow': 'Price: Low to High',
    'courses.catalog.sort.priceHigh': 'Price: High to Low',
    'courses.catalog.sort.rating': 'By Rating',
    'courses.catalog.sort.newest': 'Newest Courses',
    'courses.catalog.activeFilters': 'Active filters:',
    'courses.catalog.clearFilters': 'Clear All',
    'courses.catalog.found': 'Found',
    'courses.catalog.coursesCount': 'courses',
    'courses.catalog.loadMore': 'Show More Courses',
    'courses.catalog.empty.title': 'No Courses Found',
    'courses.catalog.empty.description': 'Try changing your search parameters or select a different category',
    'courses.catalog.empty.reset': 'Reset Filters',
    
    // Consultation Form
    'form.title': 'Get Free Consultation',
    'form.subtitle.course': 'Learn more about the course "{course}"',
    'form.subtitle.general': 'Find out which course is right for you',
    'form.fields.name.placeholder': 'Your name *',
    'form.fields.phone.placeholder': '+1 (___) ___-____ *',
    'form.fields.email.placeholder': 'Email (optional)',
    'form.fields.preferredTime.label': 'Preferred time for call:',
    'form.fields.preferredTime.any': 'Any time',
    'form.fields.preferredTime.morning': 'Morning (9:00-12:00)',
    'form.fields.preferredTime.afternoon': 'Afternoon (12:00-17:00)',
    'form.fields.preferredTime.evening': 'Evening (17:00-20:00)',
    'form.trust.secure': 'Confidential',
    'form.trust.fast': 'Response within 15 minutes',
    'form.button.submit': 'Get Free Consultation',
    'form.button.sending': 'Sending...',
    'form.success.title': 'Request Sent!',
    'form.success.message': 'We will contact you within 15 minutes',
    'form.error.message': 'An error occurred. Please try again or call us',
    'form.error.phone': 'Phone: +1 (555) 123-4567',
    'form.benefits.title': 'What you will get:',
    'form.benefits.consultation': 'Personal consultation on course selection',
    'form.benefits.program': 'Detailed learning program',
    'form.benefits.career': 'AI career development plan',
    'form.benefits.discount': 'Special offer with discount',
    'form.validation.nameRequired': 'Name is required',
    'form.validation.phoneRequired': 'Phone is required',
    'form.validation.phoneInvalid': 'Invalid phone format',
    'form.validation.emailInvalid': 'Invalid email',
    
    // Benefits Section
    'benefits.title': 'Why Choose AIStudio555',
    'benefits.subtitle': 'We created the perfect environment for your learning and career growth',
    
    // Testimonials Section
    'testimonials.title': 'Our Graduate Reviews',
    'testimonials.subtitle': 'Success stories from those who already changed their lives',
    
    // CTA Section
    'cta.title': 'Ready to Start Your IT Career?',
    'cta.subtitle': 'Join thousands of AIStudio555 graduates already working in leading IT companies worldwide',
    'cta.button.primary': 'Choose Course',
    'cta.button.secondary': 'Get Consultation',
    'cta.badge': '🔒 Secure Payment • 💳 Installments from 3 months • 📚 Lifetime Access',
    
    // Distance Learning Section
    'distanceLearning.title': 'About Distance Learning',
    'distanceLearning.description': 'Myths about distance education have been dispelled since the pandemic. Today, it\'s hard to find someone who doesn\'t believe that you can master an interesting and lucrative profession online. Online learning has entered the battle with university lectures and early mornings, and is now winning.',
    'distanceLearning.cta': 'Learn More',
    'distanceLearning.imageAlt': 'Online Learning',
    
    // Video Section  
    'videoSection.title': 'Is there life after IT courses?',
    'videoSection.videoTitle': 'Video about life after IT courses',
    'videoSection.description': 'Learn how our graduates build successful IT careers and achieve their goals after training',
    'videoSection.videoUrl': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    
    // FAQ Section
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to the most popular questions about our courses',
    
    'faq.question1': 'Can I take training courses if I have no background?',
    'faq.answer1': 'Absolutely! Our courses are designed specifically for beginners. We start with the basics and gradually move to more complex topics. Our instructors have extensive experience working with newcomers and will help you master the material regardless of your starting level.',
    
    'faq.question2': 'Do you have age restrictions for students?',
    'faq.answer2': 'We have no age restrictions! We welcome students of all ages - from recent graduates to professionals looking to change careers. AI transformation is accessible to everyone who is ready to learn and grow.',
    
    'faq.question3': 'How do I decide on choosing a direction?',
    'faq.answer3': 'We offer free career guidance consultation! Our specialists will help you choose between AI Transformation Manager, No-Code Development, or AI Video & Avatar Generation based on your interests, goals, and current experience.',
    
    'faq.question4': 'Do you provide job placement assistance after completing the course?',
    'faq.answer4': 'Yes! We provide job placement guarantee in 5+ countries worldwide. Our career center will help with resume building, interview preparation, and finding suitable vacancies. 87% of our graduates successfully find employment.',
    
    'faq.question5': 'What is the course cost and what payment options are available?',
    'faq.answer5': 'Our courses cost from $1,000 to $1,500. We offer convenient installments from 3 months, secure payments through Stripe and PayPal. Student discounts and group rates are also available.',
    
    'faq.question6': 'Does the school issue a certificate after courses?',
    'faq.answer6': 'Yes! After successfully completing the course, you will receive an AIStudio555 certificate, which is recognized by employers in the IT industry. The certificate confirms your knowledge and skills in your chosen specialization.',
    
    'faq.question7': 'What learning formats are available?',
    'faq.answer7': 'We offer online and hybrid learning formats. You can study completely remotely with a personal mentor or choose a combined approach with in-person masterclasses. All materials are available 24/7.',
    
    'faq.question8': 'Will I gain enough knowledge after the courses to start a career in IT?',
    'faq.answer8': 'Absolutely! Our courses are built on practical projects and real cases. In 3-6 months, you will gain all the necessary skills to work as a Junior specialist. Over 12,000 of our graduates are already working in leading IT companies worldwide.',
  },
  he: {
    // Common
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.close': 'סגור',
    'common.cancel': 'ביטול',
    'common.language': 'שפה',
    
    // Navigation
    'nav.courses': 'קורסים',
    'nav.monthlyStarts': 'התחלות חודשיות',
    'nav.instructors': 'מורים',
    'nav.blog': 'בלוג',
    'nav.aboutSchool': 'אודות הבית ספר',
    'nav.enrollNow': 'הרשם עכשיו',
    'nav.aiManager': 'AI Transformation Manager',
    'nav.noCode': 'פיתוח ללא קוד',
    'nav.aiVideo': 'יצירת וידאו AI',
    'nav.allCourses': 'כל הקורסים',
    'nav.aboutUs': 'עלינו',
    'nav.contacts': 'צור קשר',
    'nav.careerCenter': 'מרכז קריירה',
    'nav.profOrientation': 'הכוונה מקצועית',
    
    // Hero Section
    'hero.title': 'הפוך למומחה AI תוך 3-6 חודשים',
    'hero.subtitle': 'קורסים מעשיים להתמחות בבינה מלאכותית עם הבטחת השמה ב-5 מדינות',
    'hero.badge': 'מחזור חדש מתחיל ב-1 בפברואר',
    'hero.cta.primary': 'התחל ללמוד',
    'hero.cta.secondary': 'ייעוץ חינם',
    'hero.stats.students': '12,000+ בוגרים',
    'hero.stats.employment': '87% השמה בעבודה',
    'hero.stats.courses': '25+ קורסים',
    
    // Courses Section
    'courses.title': 'הקורסים המובילים שלנו',
    'courses.subtitle': 'בחר את הדרך שלך לעולם הבינה המלאכותית',
    'courses.viewAll': 'כל הקורסים',
    'courses.cta': 'למידע נוסף',
    
    // Benefits Section
    'benefits.title': 'למה לבחור ב-AIStudio555',
    'benefits.subtitle': 'יצרנו את הסביבה המושלמת ללמידה ולצמיחה המקצועית שלך',
    
    // Testimonials Section
    'testimonials.title': 'ביקורות הבוגרים שלנו',
    'testimonials.subtitle': 'סיפורי הצלחה של מי שכבר שינו את חייהם',
    
    // CTA Section
    'cta.title': 'מוכנים להתחיל קריירה ב-IT?',
    'cta.subtitle': 'הצטרפו לאלפי בוגרי AIStudio555 שכבר עובדים בחברות IT מובילות בעולם',
    'cta.button.primary': 'בחר קורס',
    'cta.button.secondary': 'קבל ייעוץ',
    'cta.badge': '🔒 תשלום מאובטח • 💳 תשלומים מ-3 חודשים • 📚 גישה לכל החיים',
    
    // Distance Learning Section
    'distanceLearning.title': 'על למידה מרחוק',
    'distanceLearning.description': 'המיתוסים על חינוך מרחוק נשברו מאז המגפה. היום קשה למצוא מישהו שלא מאמין שאפשר לרכוש מקצוע מעניין ומכניס באופן מקוון. למידה מקוונת נכנסה לקרב עם הרצאות באוניברסיטה והשכמות מוקדמות, וכעת מנצחת.',
    'distanceLearning.cta': 'למידע נוסף',
    'distanceLearning.imageAlt': 'למידה מקוונת',
    
    // Video Section
    'videoSection.title': 'האם יש חיים אחרי קורסי IT?',
    'videoSection.videoTitle': 'סרטון על חיים אחרי קורסי IT',
    'videoSection.description': 'למדו כיצד הבוגרים שלנו בונים קריירה מצליחה ב-IT ומשיגים את המטרות שלהם לאחר ההכשרה',
    'videoSection.videoUrl': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    
    // FAQ Section
    'faq.title': 'שאלות נפוצות',
    'faq.subtitle': 'מצא תשובות לשאלות הפופולריות ביותר על הקורסים שלנו',
    
    'faq.question1': 'האם אוכל להשתתף בקורסי הכשרה אם אין לי שום רקע?',
    'faq.answer1': 'בוודאי! הקורסים שלנו מתוכננים במיוחד למתחילים. אנו מתחילים מהבסיס ועוברים בהדרגה לנושאים מורכבים יותר. למדריכים שלנו יש ניסיון רב בעבודה עם מתחילים והם יעזרו לך לשלוט בחומר ללא קשר לרמת ההתחלה שלך.',
    
    'faq.question2': 'האם יש לכם הגבלות גיל עבור הלומדים?',
    'faq.answer2': 'אין לנו הגבלות גיל! אנו מקבלים בברכה סטודנטים בכל הגילאים - מבוגרי האוניברסיטה החדשים ועד לאנשי מקצוע המעוניינים לשנות קריירה. טרנספורמציית AI נגישה לכל מי שמוכן ללמוד ולהתפתח.',
    
    'faq.question3': 'איך להחליט על בחירת כיוון?',
    'faq.answer3': 'אנו מציעים יעוץ חינם להכוונה מקצועית! המומחים שלנו יעזרו לך לבחור בין AI Transformation Manager, פיתוח No-Code או AI Video & Avatar Generation בהתבסס על האינטרסים, המטרות והניסיון הנוכחי שלך.',
    
    'faq.question4': 'האם אתם מספקים עזרה בהשמה לעבודה לאחר סיום הקורס?',
    'faq.answer4': 'כן! אנו מספקים הבטחת השמה לעבודה ב-5+ מדינות ברחבי העולם. מרכז הקריירה שלנו יעזור בבניית קורות חיים, הכנה לראיונות ומציאת משרות מתאימות. 87% מהבוגרים שלנו מוצאים עבודה בהצלחה.',
    
    'faq.question5': 'מה העלות של הקורס ואילו אפשרויות תשלום זמינות?',
    'faq.answer5': 'הקורסים שלנו עולים בין $1,000 ל-$1,500. אנו מציעים תשלומים נוחים מ-3 חודשים, תשלומים מאובטחים דרך Stripe ו-PayPal. זמינות גם הנחות לסטודנטים ותעריפי קבוצה.',
    
    'faq.question6': 'האם בית הספר מוציא תעודה לאחר הקורסים?',
    'faq.answer6': 'כן! לאחר השלמת הקורס בהצלחה, תקבל תעודת AIStudio555 המוכרת על ידי מעסיקים בתעשיית ה-IT. התעודה מאשרת את הידע והכישורים שלך בהתמחות שבחרת.',
    
    'faq.question7': 'אילו פורמטים של למידה זמינים?',
    'faq.answer7': 'אנו מציעים פורמטים של למידה מקוונת והיברידית. אתה יכול ללמוד לחלוטין מרחוק עם מנטור אישי או לבחור בגישה משולבת עם מאסטר קלאסים פנים אל פנים. כל החומרים זמינים 24/7.',
    
    'faq.question8': 'האם אקבל מספיק ידע לאחר הקורסים כדי להתחיל קריירה ב-IT?',
    'faq.answer8': 'בהחלט! הקורסים שלנו בנויים על פרויקטים מעשיים ומקרים אמיתיים. תוך 3-6 חודשים תקבל את כל הכישורים הדרושים לעבודה כמתמחה Junior. יותר מ-12,000 בוגרים שלנו כבר עובדים בחברות IT מובילות ברחבי העולם.',
  },
};

// Enhanced translation function with parameter replacement
function formatTranslation(text: string, params?: Record<string, any>): string {
  if (!params || typeof text !== 'string') {
    return text;
  }

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }, text);
}

export function useTranslation() {
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [isLoading, setIsLoading] = useState(false);
  const [strapiConnected, setStrapiConnected] = useState<boolean | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(true); // Track if using fallback translations
  
  // Get current language from language manager
  const currentLanguage = languageManager.getCurrentLanguage();

  // Initialize language manager on mount
  useEffect(() => {
    languageManager.initialize();
    
    // Check Strapi connection status
    const checkStrapiHealth = async () => {
      try {
        const health = await strapiClient.healthCheck();
        setStrapiConnected(health.status === 'ok');
        
        setIsUsingFallback(health.status !== 'ok');
        if (process.env.NODE_ENV === 'development') {
          console.log(`🌐 Strapi connection: ${health.status}`, health.message);
        }
      } catch (error) {
        setStrapiConnected(false);
        setIsUsingFallback(true);
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Strapi health check failed:', error);
        }
      }
    };
    
    checkStrapiHealth();
  }, []);

  // Subscribe to language changes
  useEffect(() => {
    const unsubscribe = languageManager.subscribe((newLanguage) => {
      // Clear cache when language changes to force reload
      setTranslationCache({});
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Language changed to: ${newLanguage}`);
      }
    });
    
    return unsubscribe;
  }, []);

  // Main translation function
  const t = useCallback(
    async (key: string, params?: Record<string, any>): Promise<string> => {
      // Check cache first
      if (translationCache[key]?.[currentLanguage]) {
        return formatTranslation(translationCache[key][currentLanguage]!, params);
      }

      // Try to get from Strapi if connected
      if (strapiConnected) {
        try {
          setIsLoading(true);
          const translation = await strapiClient.getTranslation(key, currentLanguage);
          
          // Update cache
          setTranslationCache(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              [currentLanguage]: translation,
            },
          }));
          
          return formatTranslation(translation, params);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ Failed to get translation for key: ${key}`, error);
          }
          // Fall through to fallback logic
        } finally {
          setIsLoading(false);
        }
      }

      // Use fallback translations with hierarchy: current → ru → en → key
      const fallbackHierarchy = languageManager.getFallbackHierarchy(currentLanguage);
      
      for (const lang of fallbackHierarchy) {
        const fallbackText = fallbackTranslations[lang]?.[key];
        if (fallbackText) {
          // Cache the fallback
          setTranslationCache(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              [currentLanguage]: fallbackText,
            },
          }));
          
          return formatTranslation(fallbackText, params);
        }
      }

      // Return key as final fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🚨 No translation found for key: ${key}`);
      }
      
      return formatTranslation(key, params);
    },
    [currentLanguage, translationCache, strapiConnected],
  );

  // Synchronous translation function for immediate use
  const tSync = useCallback(
    (key: string, params?: Record<string, any>): string => {
      // Check cache first
      if (translationCache[key]?.[currentLanguage]) {
        return formatTranslation(translationCache[key][currentLanguage]!, params);
      }

      // Use fallback translations with hierarchy
      const fallbackHierarchy = languageManager.getFallbackHierarchy(currentLanguage);
      
      for (const lang of fallbackHierarchy) {
        const fallbackText = fallbackTranslations[lang]?.[key];
        if (fallbackText) {
          return formatTranslation(fallbackText, params);
        }
      }

      // Return key as final fallback
      return formatTranslation(key, params);
    },
    [currentLanguage, translationCache],
  );

  // Preload translations for better performance
  const preloadTranslations = useCallback(
    async (keys: string[]) => {
      if (!strapiConnected || keys.length === 0) return;
      
      try {
        setIsLoading(true);
        const translationMap = await strapiClient.getTranslationsMap(keys, currentLanguage);
        
        // Update cache with all translations
        setTranslationCache(prev => {
          const updated = { ...prev };
          Object.entries(translationMap).forEach(([key, value]) => {
            updated[key] = {
              ...updated[key],
              [currentLanguage]: value,
            };
          });
          return updated;
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📦 Preloaded ${Object.keys(translationMap).length} translations`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Failed to preload translations:', error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentLanguage, strapiConnected],
  );

  // Change language with immediate UI update
  const changeLanguage = useCallback((newLanguage: Language) => {
    languageManager.setLanguage(newLanguage);
  }, []);

  // Clear translation cache (useful for development/admin)
  const clearCache = useCallback(() => {
    setTranslationCache({});
    strapiClient.clearCache();
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Translation cache cleared');
    }
  }, []);

  return {
    t,
    tSync, // Synchronous version for immediate use
    language: currentLanguage,
    changeLanguage,
    languages: languageManager.getAvailableLanguages(),
    isLoading,
    strapiConnected,
    isUsingFallback, // Expose fallback status
    preloadTranslations,
    clearCache,
    // Language utility functions
    isRTL: languageManager.isRTL(currentLanguage),
    getLanguageConfig: () => languageManager.getLanguageConfig(currentLanguage),
    getDirectionClass: () => languageManager.getDirectionClass(currentLanguage),
    getLanguageClass: () => languageManager.getLanguageClass(currentLanguage),
  };
}

// Export types for use in components
export type { Language };
export type TranslationFunction = ReturnType<typeof useTranslation>['t'];
