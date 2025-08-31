# Complete Database Schema - Projectdes AI Academy

## Core Business Entities

### Authentication & Users

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  passwordHash    String
  emailVerified   Boolean   @default(false)
  role            UserRole  @default(STUDENT)

  // Relations
  profile         UserProfile?
  enrollments     Enrollment[]
  payments        Payment[]
  progress        Progress[]
  notifications   Notification[]
  sessions        Session[]

  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  lastLoginAt     DateTime?

  @@index([email])
  @@index([role])
  @@index([createdAt])
}

model UserProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  firstName       String
  lastName        String
  phone           String?
  avatar          String?
  bio             Json?     // Rich text from TipTap
  locale          Locale    @default(EN)
  timezone        String    @default("UTC")

  // Professional Info
  company         String?
  position        String?
  linkedin        String?
  github          String?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([userId])
}

model Session {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  token           String    @unique
  expiresAt       DateTime
  ipAddress       String?
  userAgent       String?

  createdAt       DateTime  @default(now())

  @@index([token])
  @@index([userId])
  @@index([expiresAt])
}
```

### Course Structure

```prisma
model Course {
  id              String    @id @default(uuid())
  slug            String    @unique

  // Multi-language content
  title           Json      // {"en": "...", "ru": "...", "he": "..."}
  description     Json      // TipTap JSON with translations
  thumbnail       String?

  // Pricing
  price           Decimal   @db.Decimal(10, 2)
  currency        String    @default("USD")
  discountPrice   Decimal?  @db.Decimal(10, 2)

  // Metadata
  level           CourseLevel @default(BEGINNER)
  duration        Int       // in hours
  language        Locale    @default(EN)

  // Relations
  categoryId      String
  category        Category  @relation(fields: [categoryId], references: [id])
  instructorId    String
  instructor      Instructor @relation(fields: [instructorId], references: [id])

  modules         Module[]
  enrollments     Enrollment[]
  reviews         Review[]
  prerequisites   Course[]  @relation("Prerequisites")

  // Publishing
  status          CourseStatus @default(DRAFT)
  publishedAt     DateTime?

  // SEO
  metaTitle       String?
  metaDescription String?
  keywords        String[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([slug])
  @@index([status])
  @@index([categoryId])
  @@index([instructorId])
  @@index([publishedAt])
}

model Module {
  id              String    @id @default(uuid())
  courseId        String
  course          Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)

  title           Json      // Multi-language
  description     Json?
  order           Int

  lessons         Lesson[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([courseId, order])
  @@index([courseId])
}

model Lesson {
  id              String    @id @default(uuid())
  moduleId        String
  module          Module    @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  title           Json      // Multi-language
  content         Json      // TipTap JSON content
  videoUrl        String?
  duration        Int?      // in minutes
  order           Int

  // Resources
  resources       Resource[]
  assignments     Assignment[]
  progress        Progress[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([moduleId, order])
  @@index([moduleId])
}
```

### Learning & Progress

```prisma
model Enrollment {
  id              String    @id @default(uuid())

  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId        String
  course          Course    @relation(fields: [courseId], references: [id])

  status          EnrollmentStatus @default(ACTIVE)
  enrolledAt      DateTime  @default(now())
  startedAt       DateTime?
  completedAt     DateTime?
  expiresAt       DateTime?

  // Progress tracking
  progressPercent Int       @default(0)
  lastAccessedAt  DateTime?

  progress        Progress[]
  certificate     Certificate?

  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
  @@index([status])
}

model Progress {
  id              String    @id @default(uuid())

  enrollmentId    String
  enrollment      Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  lessonId        String
  lesson          Lesson    @relation(fields: [lessonId], references: [id])
  userId          String
  user            User      @relation(fields: [userId], references: [id])

  status          ProgressStatus @default(NOT_STARTED)
  startedAt       DateTime?
  completedAt     DateTime?

  // Tracking
  videoProgress   Int       @default(0) // percentage watched
  attempts        Int       @default(0)
  score           Float?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([enrollmentId, lessonId])
  @@index([enrollmentId])
  @@index([lessonId])
  @@index([userId])
}
```

### Payments & Transactions

```prisma
model Payment {
  id              String    @id @default(uuid())

  userId          String
  user            User      @relation(fields: [userId], references: [id])
  courseId        String?

  amount          Decimal   @db.Decimal(10, 2)
  currency        String

  status          PaymentStatus @default(PENDING)
  provider        PaymentProvider
  providerId      String?   // Stripe/PayPal transaction ID

  // Details
  description     String?
  metadata        Json?

  // Timestamps
  createdAt       DateTime  @default(now())
  paidAt          DateTime?
  refundedAt      DateTime?

  @@index([userId])
  @@index([status])
  @@index([provider])
  @@index([createdAt])
}

model Coupon {
  id              String    @id @default(uuid())
  code            String    @unique

  discountType    DiscountType // PERCENTAGE, FIXED
  discountValue   Decimal   @db.Decimal(10, 2)

  validFrom       DateTime
  validUntil      DateTime
  usageLimit      Int?
  usageCount      Int       @default(0)

  // Restrictions
  courseIds       String[]  // Empty = all courses

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([code])
  @@index([validFrom, validUntil])
}
```

### Content & Resources

```prisma
model Category {
  id              String    @id @default(uuid())
  slug            String    @unique

  name            Json      // Multi-language
  description     Json?
  icon            String?

  parentId        String?
  parent          Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children        Category[] @relation("CategoryHierarchy")

  courses         Course[]

  order           Int       @default(0)
  isActive        Boolean   @default(true)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([slug])
  @@index([parentId])
}

model Resource {
  id              String    @id @default(uuid())
  lessonId        String
  lesson          Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  title           String
  type            ResourceType // PDF, VIDEO, LINK, CODE
  url             String
  size            Int?      // in bytes

  createdAt       DateTime  @default(now())

  @@index([lessonId])
}

model Assignment {
  id              String    @id @default(uuid())
  lessonId        String
  lesson          Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  title           Json
  description     Json      // TipTap JSON
  type            AssignmentType // QUIZ, PROJECT, EXERCISE

  questions       Json?     // For quizzes
  maxScore        Float?
  passingScore    Float?

  submissions     Submission[]

  dueDate         DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([lessonId])
}

model Submission {
  id              String    @id @default(uuid())
  assignmentId    String
  assignment      Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  userId          String

  content         Json      // Submission data
  score           Float?
  feedback        Json?

  status          SubmissionStatus @default(PENDING)
  submittedAt     DateTime  @default(now())
  gradedAt        DateTime?

  @@index([assignmentId])
  @@index([userId])
}
```

### Reviews & Ratings

```prisma
model Review {
  id              String    @id @default(uuid())
  courseId        String
  course          Course    @relation(fields: [courseId], references: [id])
  userId          String

  rating          Int       // 1-5
  title           String?
  content         String?

  isVerified      Boolean   @default(false)
  isPublished     Boolean   @default(true)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([courseId, userId])
  @@index([courseId])
  @@index([userId])
  @@index([rating])
}
```

### Notifications

```prisma
model Notification {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  type            NotificationType
  title           String
  message         String
  data            Json?

  isRead          Boolean   @default(false)
  readAt          DateTime?

  createdAt       DateTime  @default(now())

  @@index([userId, isRead])
  @@index([createdAt])
}
```

### Analytics & Tracking

```prisma
model PageView {
  id              String    @id @default(uuid())
  userId          String?
  sessionId       String

  path            String
  referrer        String?

  // Device info
  userAgent       String?
  ipAddress       String?
  country         String?

  timestamp       DateTime  @default(now())

  @@index([userId])
  @@index([sessionId])
  @@index([path])
  @@index([timestamp])
}

model CourseAnalytics {
  id              String    @id @default(uuid())
  courseId        String

  views           Int       @default(0)
  enrollments     Int       @default(0)
  completions     Int       @default(0)
  avgRating       Float?
  avgProgress     Float?

  date            DateTime  @db.Date

  @@unique([courseId, date])
  @@index([courseId])
  @@index([date])
}
```

## Enums

```prisma
enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
  SUPPORT
}

enum Locale {
  EN
  RU
  HE
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum EnrollmentStatus {
  ACTIVE
  PAUSED
  COMPLETED
  EXPIRED
  CANCELLED
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentProvider {
  STRIPE
  PAYPAL
  BEPAID
}

enum DiscountType {
  PERCENTAGE
  FIXED
}

enum ResourceType {
  PDF
  VIDEO
  LINK
  CODE
  DOWNLOAD
}

enum AssignmentType {
  QUIZ
  PROJECT
  EXERCISE
  EXAM
}

enum SubmissionStatus {
  PENDING
  GRADED
  RETURNED
}

enum NotificationType {
  SYSTEM
  COURSE
  PAYMENT
  ACHIEVEMENT
  REMINDER
}
```

## Database Indexes & Performance

### Composite Indexes

```sql
-- Optimize common queries
CREATE INDEX idx_enrollment_user_status ON "Enrollment"("userId", "status");
CREATE INDEX idx_progress_enrollment_status ON "Progress"("enrollmentId", "status");
CREATE INDEX idx_payment_user_date ON "Payment"("userId", "createdAt" DESC);
CREATE INDEX idx_course_category_status ON "Course"("categoryId", "status");

-- Full-text search
CREATE INDEX idx_course_search ON "Course" USING gin(to_tsvector('english', title || ' ' || description));
```

### Performance Considerations

1. **Pagination**: Use cursor-based pagination for large datasets
2. **Caching**: Redis for session management and frequently accessed data
3. **Read Replicas**: For analytics and reporting queries
4. **Partitioning**: Consider partitioning PageView and CourseAnalytics by date

## Migration Strategy

### Initial Setup

```bash
npx prisma init
npx prisma db push # Development
npx prisma migrate dev --name init # Create migration
```

### Seed Data

```typescript
// prisma/seed.ts
const seedDatabase = async () => {
  // Create admin user
  // Create categories
  // Create sample courses
  // Create test enrollments
};
```

## Security Notes

1. **Password Hashing**: Use bcrypt with salt rounds >= 12
2. **Session Management**: Rotate tokens, implement refresh tokens
3. **Rate Limiting**: Implement on authentication endpoints
4. **Input Validation**: Use Zod schemas for all inputs
5. **SQL Injection**: Prisma parameterizes queries by default
6. **Data Encryption**: Encrypt sensitive fields (payment data)
