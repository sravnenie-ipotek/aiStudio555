/**
 * Translation hook for internationalization
 * Supports Russian, Hebrew, and English
 */

import { useState, useEffect, useCallback } from 'react';

type Language = 'en' | 'he' | 'ru';

interface TranslationData {
  [key: string]: string | TranslationData;
}

// Translation keys with nested structure
const translations: Record<Language, TranslationData> = {
  en: {
    common: {
      next: 'Next',
      back: 'Back',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      submit: 'Submit',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      loading: 'Loading...',
      processing: 'Processing...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      done: 'Done',
      month: 'month',
    },
    nav: {
      // Header Navigation
      courses: 'Courses',
      monthlyStarts: 'Monthly Starts',
      instructors: 'Teachers',
      blog: 'Blog',
      aboutSchool: 'About School',
      // Course Submenu
      aiManager: 'AI Transformation Manager',
      noCode: 'No-Code Development',
      aiVideo: 'AI Video Generation',
      allCourses: 'All Courses',
      // About Submenu
      aboutUs: 'About Us',
      contacts: 'Contacts',
      careerCenter: 'Career Center',
      profOrientation: 'Career Guidance',
      // Call to Action
      enrollNow: 'Enroll Now',
      // User Dashboard Navigation
      dashboard: 'Dashboard',
      certificates: 'Certificates',
      messages: 'Messages',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      menu: 'Menu',
      learning: 'Learning',
      community: 'Community',
      account: 'Account',
      myCourses: 'My Courses',
      progress: 'Progress',
      schedule: 'Schedule',
      groups: 'Groups',
      forums: 'Forums',
      payments: 'Payments',
      support: 'Support',
    },
    enrollment: {
      steps: {
        details: 'Student Details',
        payment: 'Payment',
        confirmation: 'Confirmation',
      },
      studentDetails: {
        title: 'Student Information',
        description: 'Please provide your information to enroll in this course',
      },
      fields: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        country: 'Country',
        timezone: 'Timezone',
        studyGoals: 'Study Goals',
        studyGoalsPlaceholder: 'What do you hope to achieve from this course?',
        preferredLanguage: 'Preferred Language',
        subscribeNewsletter: 'Subscribe to newsletter for course updates',
      },
      payment: {
        title: 'Payment Information',
        description: 'Choose your payment method and plan',
        selectMethod: 'Select Payment Method',
        selectPlan: 'Select Payment Plan',
        methods: {
          creditCard: 'Credit/Debit Card',
          creditCardDescription: 'Pay securely with your credit or debit card',
          paypal: 'PayPal',
          paypalDescription: 'Fast and secure payment with PayPal',
          bankTransfer: 'Bank Transfer',
          bankTransferDescription: 'Direct bank transfer (3-5 business days)',
        },
        plans: {
          full: 'Full Payment',
          fullDescription: 'Pay in full and save',
          threeMonths: '3 Monthly Installments',
          threeMonthsDescription: '3 easy monthly payments',
          sixMonths: '6 Monthly Installments',
          sixMonthsDescription: '6 easy monthly payments',
          twelveMonths: '12 Monthly Installments',
          twelveMonthsDescription: '12 easy monthly payments',
        },
        subtotal: 'Subtotal',
        installmentFee: 'Installment Fee',
        total: 'Total',
        recommended: 'Recommended',
        securePayment: 'Secure Payment',
        securePaymentDescription: 'Your payment information is encrypted and secure',
        moneyBackGuarantee: '30-Day Money Back Guarantee',
        moneyBackDescription: "Full refund if you're not satisfied within 30 days",
        agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
        completePurchase: 'Complete Purchase',
      },
      confirmation: {
        title: 'Enrollment Successful!',
        message: 'Congratulations! You have successfully enrolled in {courseName}',
        nextSteps: 'Next Steps',
        step1: 'Check your email for login credentials',
        step2: 'Access course materials in your dashboard',
        step3: 'Join the student community forum',
        goToDashboard: 'Go to Dashboard',
        browseMoreCourses: 'Browse More Courses',
      },
      summary: {
        title: 'Order Summary',
        whatYouGet: "What You'll Get",
        lifetimeAccess: 'Lifetime access to course materials',
        expertSupport: 'Direct support from expert instructors',
        jobPlacement: 'Job placement assistance',
        totalPrice: 'Total Price',
        perMonth: '${amount}/month',
      },
    },
    progress: {
      completed: 'Completed',
      inProgress: 'In Progress',
      lessonsCompleted: '{completed} of {total} lessons',
      currentLesson: 'Current Lesson',
      timeSpent: 'Time Spent',
      lastAccessed: 'Last Accessed',
      estimatedCompletion: 'Est. Completion',
      learningStreak: 'Learning Streak',
      days: 'days',
      achievements: 'Achievements',
      current: 'Current',
      review: 'Review',
      continue: 'Continue',
      start: 'Start',
      resources: 'Resources',
    },
    certificates: {
      yourCertificate: 'Your Certificate',
      verified: 'Verified',
      title: 'Certificate of Completion',
      subtitle: 'This is to certify that',
      presentedTo: 'Presented to',
      forCompleting: 'For successfully completing',
      withGrade: 'With grade',
      skillsAcquired: 'Skills Acquired',
      completionDate: 'Completion Date',
      instructor: 'Instructor',
      certificateNumber: 'Certificate Number',
      verifyAt: 'Verify at',
      downloadPDF: 'Download PDF',
      downloadPNG: 'Download PNG',
      print: 'Print',
      share: 'Share',
      copyLink: 'Copy Link',
      shareText: 'I just earned my certificate in {courseName}!',
      info: {
        title: 'Certificate Information',
        blockchainVerified: 'Blockchain Verified',
        blockchainDescription: 'Permanently recorded on blockchain',
        industryRecognized: 'Industry Recognized',
        industryDescription: 'Accepted by leading companies',
        lifetimeValid: 'Lifetime Validity',
        lifetimeDescription: 'Your certificate never expires',
        dateIssued: 'Date Issued',
      },
    },
    messaging: {
      conversations: 'Conversations',
      searchConversations: 'Search conversations...',
      all: 'All',
      unread: 'Unread',
      archived: 'Archived',
      support: 'Support',
      unknown: 'Unknown',
      online: 'Online',
      offline: 'Offline',
      members: 'members',
      typeMessage: 'Type a message...',
      selectConversation: 'Select a conversation to start messaging',
      edited: 'edited',
    },
    payments: {
      totalSpent: 'Total Spent',
      completed: 'Completed',
      pending: 'Pending',
      upcoming: 'Upcoming',
      history: 'Payment History',
      export: 'Export',
      searchPlaceholder: 'Search payments...',
      startDate: 'Start Date',
      endDate: 'End Date',
      all: 'All',
      status: {
        completed: 'Completed',
        pending: 'Pending',
        failed: 'Failed',
        refunded: 'Refunded',
      },
      date: 'Date',
      description: 'Description',
      amount: 'Amount',
      method: 'Method',
      invoice: 'Invoice',
      actions: 'Actions',
      noPayments: 'No payments found',
      installment: 'Installment {current} of {total}',
      methods: {
        credit_card: 'Credit Card',
        paypal: 'PayPal',
        bank_transfer: 'Bank Transfer',
      },
      details: 'Payment Details',
      transactionId: 'Transaction ID',
      downloadInvoice: 'Download Invoice',
    },
    support: {
      title: 'Support Center',
      description: 'How can we help you today?',
      email: 'Email Support',
      phone: 'Phone Support',
      liveChat: 'Live Chat',
      available247: '24/7 Available',
      searchPlaceholder: 'Search for help...',
      categories: {
        all: 'All',
        general: 'General',
        technical: 'Technical',
        billing: 'Billing',
        courses: 'Courses',
        certificates: 'Certificates',
      },
      faq: 'FAQ',
      tickets: 'Tickets',
      resources: 'Resources',
      contact: 'Contact',
      frequentlyAsked: 'Frequently Asked Questions',
      wasHelpful: 'Was this helpful?',
      myTickets: 'My Tickets',
      newTicket: 'New Ticket',
      noTickets: 'No support tickets yet',
      createFirstTicket: 'Create Your First Ticket',
      ticket: 'Ticket',
      responses: 'responses',
      helpfulResources: 'Helpful Resources',
      viewResource: 'View Resource',
      getInTouch: 'Get In Touch',
      contactDescription: "Send us a message and we'll respond within 24 hours",
      yourName: 'Your Name',
      yourEmail: 'Your Email',
      subject: 'Subject',
      message: 'Message',
      messagePlaceholder: 'Describe your issue or question...',
      sendMessage: 'Send Message',
      createNewTicket: 'Create New Ticket',
      subjectPlaceholder: 'Brief description of your issue',
      category: 'Category',
      priority: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        urgent: 'Urgent',
      },
      description: 'Description',
      descriptionPlaceholder: 'Provide detailed information about your issue...',
      createTicket: 'Create Ticket',
      you: 'You',
      typeReply: 'Type your reply...',
      sendReply: 'Send Reply',
    },
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark all read',
      preferences: 'Preferences',
      emailNotifications: 'Email Notifications',
      pushNotifications: 'Push Notifications',
      soundNotifications: 'Sound Notifications',
      notificationTypes: 'Notification Types',
      courseUpdates: 'Course Updates',
      messages: 'Messages',
      payments: 'Payments',
      achievements: 'Achievements',
      all: 'All',
      unread: 'Unread',
      archived: 'Archived',
      noUnread: 'No unread notifications',
      noArchived: 'No archived notifications',
      noNotifications: 'No notifications yet',
      viewDetails: 'View Details',
      priority: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
      },
      justNow: 'Just now',
      minutesAgo: '{count} minutes ago',
      hoursAgo: '{count} hours ago',
      daysAgo: '{count} days ago',
    },
    search: {
      placeholder: 'Search courses, lessons, or topics...',
      recentSearches: 'Recent Searches',
    },
    course: {
      duration: 'Duration',
      startDate: 'Start Date',
      flexibleStart: 'Flexible Start',
      format: 'Format',
      online: 'Online',
      certificate: 'Certificate',
      included: 'Included',
    },
  },
  ru: {
    common: {
      next: 'Далее',
      back: 'Назад',
      close: 'Закрыть',
      cancel: 'Отмена',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      submit: 'Отправить',
      search: 'Поиск',
      filter: 'Фильтр',
      sort: 'Сортировка',
      loading: 'Загрузка...',
      processing: 'Обработка...',
      error: 'Ошибка',
      success: 'Успешно',
      warning: 'Предупреждение',
      info: 'Информация',
      confirm: 'Подтвердить',
      yes: 'Да',
      no: 'Нет',
      done: 'Готово',
      month: 'месяц',
    },
    nav: {
      // Header Navigation
      courses: 'Курсы',
      monthlyStarts: 'Старты месяца',
      instructors: 'Преподаватели',
      blog: 'Блог',
      aboutSchool: 'О школе',
      // Course Submenu
      aiManager: 'AI Transformation Manager',
      noCode: 'No-Code разработка',
      aiVideo: 'AI видео генерация',
      allCourses: 'Все курсы',
      // About Submenu
      aboutUs: 'О нас',
      contacts: 'Контакты',
      careerCenter: 'Карьерный центр',
      profOrientation: 'Профориентация',
      // Call to Action
      enrollNow: 'Записаться сейчас',
      // User Dashboard Navigation
      dashboard: 'Панель управления',
      certificates: 'Сертификаты',
      messages: 'Сообщения',
      profile: 'Профиль',
      settings: 'Настройки',
      logout: 'Выйти',
      menu: 'Меню',
      learning: 'Обучение',
      community: 'Сообщество',
      account: 'Аккаунт',
      myCourses: 'Мои курсы',
      progress: 'Прогресс',
      schedule: 'Расписание',
      groups: 'Группы',
      forums: 'Форумы',
      payments: 'Платежи',
      support: 'Поддержка',
    },
  },
  he: {
    // Hebrew translations (simplified for brevity)
    common: {
      next: 'הבא',
      back: 'חזור',
      close: 'סגור',
      cancel: 'ביטול',
      save: 'שמור',
      // ... add all Hebrew translations
    },
    // ... add all sections in Hebrew
  },
};

// Get nested translation value
function getNestedTranslation(obj: any, path: string, params?: Record<string, any>): string {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return the key if translation not found
    }
  }

  if (typeof result !== 'string') {
    return path;
  }

  // Replace parameters in the translation
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`{${key}}`, String(value));
    });
  }

  return result;
}

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from localStorage or default to 'en'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved && ['en', 'ru', 'he'].includes(saved)) {
        return saved as Language;
      }
    }
    return 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      // Set document direction for RTL languages
      document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback(
    (key: string, params?: Record<string, any>): string => {
      return getNestedTranslation(translations[language], key, params);
    },
    [language],
  );

  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
  }, []);

  return {
    t,
    language,
    changeLanguage,
    languages: ['en', 'ru', 'he'] as Language[],
  };
}

// Export types for use in components
export type { Language };
export type TranslationFunction = ReturnType<typeof useTranslation>['t'];
