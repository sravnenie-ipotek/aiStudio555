# Projectdes AI Academy - Frontend

Next.js 14 frontend application for the Projectdes AI Academy platform.

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Query (TanStack)
- **Forms**: React Hook Form + Zod
- **Fonts**: Rubik (Google Fonts)
- **Theme**: Light/Dark mode support

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── sections/    # Page sections
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── styles/          # Global styles
└── types/           # TypeScript types
```

## 🎨 Design System

- **Primary Color**: #FFDA17 (Yellow)
- **Spacing**: 8px unit system
- **Typography**: Rubik font family
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant

## 🚦 Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Check TypeScript types
- `pnpm test` - Run tests

## 🌍 Internationalization

The app supports three languages:
- Russian (default)
- Hebrew (with RTL support)
- English

## ⚡ Performance Targets

- Lighthouse Score: 90+
- LCP: <2.5s
- CLS: <0.1
- INP: <200ms

## 🔒 Environment Variables

See `.env.example` for required environment variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal client ID

## 📚 Documentation

- Architecture: `/docs/architecture/`
- Design System: `/docs/architecture/design/`
- Components: `/docs/architecture/design/COMPLETE-UI-COMPONENT-LIBRARY.md`

## 🔄 Next Steps

- [ ] Complete Header and Footer components
- [ ] Implement language switcher
- [ ] Create authentication pages
- [ ] Build dashboard pages
- [ ] Add payment flow
- [ ] Integrate with backend API