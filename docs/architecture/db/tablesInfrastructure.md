model Instructor { id String @id @default(uuid()) locale Locale name String
company String? bio Json? // TipTap JSON avatarId String? avatar MediaAsset?
@relation(fields: [avatarId], references: [id]) linkedin String? website String?
@@index([locale, name]) }

model Partner { id String @id @default(uuid()) locale Locale name String logoId
String? logo MediaAsset? @relation(fields: [logoId], references: [id]) url
String? blurb String? order Int @default(0) @@index([locale, order]) }

model Testimonial { id String @id @default(uuid()) locale Locale studentName
String avatarId String? avatar MediaAsset? @relation(fields: [avatarId],
references: [id]) quote String courseId String? course Course? @relation(fields:
[courseId], references: [id]) order Int @default(0) isPublished Boolean
@default(true) @@index([locale, isPublished, order]) }

model Event { id String @id @default(uuid()) locale Locale slug String title
String description Json // TipTap JSON startAt DateTime endAt DateTime? location
String? streamingUrl String? registerUrl String? coverId String? cover
MediaAsset? @relation(fields: [coverId], references: [id]) isPublished Boolean
@default(false) @@unique([slug, locale]) @@index([locale, startAt, isPublished])
}

model LegalDocument { id String @id @default(uuid()) locale Locale slug String
title String body Json // TipTap JSON isPublished Boolean @default(true)
updatedAt DateTime @updatedAt @@unique([slug, locale]) }

model Campaign { id String @id @default(uuid()) locale Locale slug String title
String body Json // block content (TipTap/blocks) bannerId String? banner
MediaAsset? @relation(fields: [bannerId], references: [id]) discountPct Int?
startsAt DateTime? endsAt DateTime? active Boolean @default(false)
@@unique([slug, locale]) @@index([active, startsAt, endsAt]) }

model Announcement { id String @id @default(uuid()) locale Locale kind
AnnouncementType @default(GENERAL) title String message String? startsAt
DateTime? endsAt DateTime? priority Int @default(0) isPublished Boolean
@default(true) @@index([locale, isPublished, startsAt, endsAt]) }

model CareerResource { id String @id @default(uuid()) locale Locale kind String
// "article" | "link" | "template" | ... title String description String? url
String? isPublished Boolean @default(true) order Int @default(0)
@@index([locale, kind, isPublished, order]) }
