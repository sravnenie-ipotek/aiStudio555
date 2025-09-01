-- =====================================================
-- Course Catalog Enhancement Migration
-- =====================================================
-- Date: 2025-09-01
-- Purpose: Extend Course model to support course catalog page implementation
-- Impact: Add marketing fields, computed metrics, and course scheduling
-- Safety: All fields are optional to maintain existing data integrity

-- Add CourseFormat enum
CREATE TYPE "CourseFormat" AS ENUM ('ONLINE', 'HYBRID', 'IN_PERSON');

-- Extend Course table with new fields
ALTER TABLE "Course"
ADD COLUMN "shortDescription" JSONB,
ADD COLUMN "heroImage" TEXT,
ADD COLUMN "thumbnailImage" TEXT,
ADD COLUMN "keyBenefits" TEXT[] DEFAULT '{}',
ADD COLUMN "targetAudience" TEXT[] DEFAULT '{}',
ADD COLUMN "careerOutcomes" TEXT[] DEFAULT '{}',
ADD COLUMN "skillsLearned" TEXT[] DEFAULT '{}',
ADD COLUMN "features" JSONB[] DEFAULT '{}',
ADD COLUMN "format" "CourseFormat" DEFAULT 'ONLINE',
ADD COLUMN "platform" TEXT,
ADD COLUMN "paymentPlans" JSONB[] DEFAULT '{}',
ADD COLUMN "durationWeeks" INTEGER,
ADD COLUMN "hoursPerWeek" INTEGER,
ADD COLUMN "totalHours" INTEGER,
ADD COLUMN "studentCount" INTEGER DEFAULT 0,
ADD COLUMN "averageRating" REAL,
ADD COLUMN "completionRate" REAL,
ADD COLUMN "nextStartDate" TIMESTAMP(3),
ADD COLUMN "enrollmentDeadline" TIMESTAMP(3),
ADD COLUMN "maxStudents" INTEGER,
ADD COLUMN "minStudents" INTEGER,
ADD COLUMN "difficulty" INTEGER DEFAULT 1,
ADD COLUMN "isActive" BOOLEAN DEFAULT TRUE,
ADD COLUMN "isFeatured" BOOLEAN DEFAULT FALSE,
ADD COLUMN "ogImage" TEXT;

-- Add new indexes for course catalog performance
CREATE INDEX "Course_isActive_idx" ON "Course"("isActive");
CREATE INDEX "Course_isFeatured_idx" ON "Course"("isFeatured");
CREATE INDEX "Course_studentCount_idx" ON "Course"("studentCount");
CREATE INDEX "Course_averageRating_idx" ON "Course"("averageRating");
CREATE INDEX "Course_nextStartDate_idx" ON "Course"("nextStartDate");
CREATE INDEX "Course_price_idx" ON "Course"("price");

-- Computed field update function for studentCount
CREATE OR REPLACE FUNCTION update_course_student_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update studentCount when enrollment changes
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE "Course" 
        SET "studentCount" = (
            SELECT COUNT(*) 
            FROM "Enrollment" 
            WHERE "courseId" = NEW."courseId"
            AND "status" IN ('ACTIVE', 'COMPLETED')
        )
        WHERE "id" = NEW."courseId";
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE "Course" 
        SET "studentCount" = (
            SELECT COUNT(*) 
            FROM "Enrollment" 
            WHERE "courseId" = OLD."courseId"
            AND "status" IN ('ACTIVE', 'COMPLETED')
        )
        WHERE "id" = OLD."courseId";
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update studentCount
DROP TRIGGER IF EXISTS enrollment_student_count_trigger ON "Enrollment";
CREATE TRIGGER enrollment_student_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "Enrollment"
    FOR EACH ROW EXECUTE FUNCTION update_course_student_count();

-- Computed field update function for averageRating
CREATE OR REPLACE FUNCTION update_course_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update averageRating when review changes
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE "Course" 
        SET "averageRating" = (
            SELECT AVG("rating")::REAL
            FROM "Review" 
            WHERE "courseId" = NEW."courseId"
            AND "isPublished" = TRUE
        )
        WHERE "id" = NEW."courseId";
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE "Course" 
        SET "averageRating" = (
            SELECT AVG("rating")::REAL
            FROM "Review" 
            WHERE "courseId" = OLD."courseId"
            AND "isPublished" = TRUE
        )
        WHERE "id" = OLD."courseId";
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update averageRating
DROP TRIGGER IF EXISTS review_average_rating_trigger ON "Review";
CREATE TRIGGER review_average_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "Review"
    FOR EACH ROW EXECUTE FUNCTION update_course_average_rating();

-- Initialize computed fields for existing courses
UPDATE "Course" 
SET "studentCount" = (
    SELECT COUNT(*) 
    FROM "Enrollment" 
    WHERE "Enrollment"."courseId" = "Course"."id"
    AND "Enrollment"."status" IN ('ACTIVE', 'COMPLETED')
);

UPDATE "Course" 
SET "averageRating" = (
    SELECT AVG("rating")::REAL
    FROM "Review" 
    WHERE "Review"."courseId" = "Course"."id"
    AND "Review"."isPublished" = TRUE
);

-- Initialize totalHours from existing duration field
UPDATE "Course" 
SET "totalHours" = "duration"
WHERE "totalHours" IS NULL AND "duration" IS NOT NULL;

-- Add check constraints for data integrity
ALTER TABLE "Course" 
ADD CONSTRAINT "Course_difficulty_check" CHECK ("difficulty" >= 1 AND "difficulty" <= 5),
ADD CONSTRAINT "Course_student_count_check" CHECK ("studentCount" >= 0),
ADD CONSTRAINT "Course_rating_check" CHECK ("averageRating" >= 0 AND "averageRating" <= 5),
ADD CONSTRAINT "Course_completion_rate_check" CHECK ("completionRate" >= 0 AND "completionRate" <= 100),
ADD CONSTRAINT "Course_max_students_check" CHECK ("maxStudents" > 0),
ADD CONSTRAINT "Course_min_students_check" CHECK ("minStudents" > 0),
ADD CONSTRAINT "Course_min_max_students_check" CHECK ("minStudents" <= "maxStudents");

-- Create helper view for course catalog queries
CREATE OR REPLACE VIEW "CourseWithMetrics" AS
SELECT 
    c.*,
    COALESCE(c."studentCount", 0) as "totalStudents",
    COALESCE(c."averageRating", 0) as "avgRating",
    cat."name" as "categoryName",
    cat."slug" as "categorySlug",
    inst."name" as "instructorName",
    -- Calculate if course is upcoming
    CASE 
        WHEN c."nextStartDate" > NOW() THEN TRUE 
        ELSE FALSE 
    END as "isUpcoming",
    -- Calculate enrollment status
    CASE 
        WHEN c."enrollmentDeadline" IS NULL THEN 'OPEN'
        WHEN c."enrollmentDeadline" > NOW() THEN 'OPEN'
        ELSE 'CLOSED'
    END as "enrollmentStatus",
    -- Calculate days until start
    CASE 
        WHEN c."nextStartDate" > NOW() 
        THEN EXTRACT(DAY FROM (c."nextStartDate" - NOW()))::INTEGER
        ELSE NULL
    END as "daysUntilStart"
FROM "Course" c
LEFT JOIN "Category" cat ON c."categoryId" = cat."id"
LEFT JOIN "Instructor" inst ON c."instructorId" = inst."id"
WHERE c."isActive" = TRUE;

-- Create indexes on the view for better performance
CREATE INDEX CONCURRENTLY "CourseWithMetrics_featured_idx" 
ON "Course"("isFeatured", "isActive") 
WHERE "isActive" = TRUE;

CREATE INDEX CONCURRENTLY "CourseWithMetrics_category_popularity_idx" 
ON "Course"("categoryId", "studentCount" DESC, "isActive") 
WHERE "isActive" = TRUE;

-- Add comments for documentation
COMMENT ON COLUMN "Course"."shortDescription" IS 'Brief description for catalog cards';
COMMENT ON COLUMN "Course"."heroImage" IS 'Large hero image for course detail page';
COMMENT ON COLUMN "Course"."thumbnailImage" IS 'Catalog card thumbnail image';
COMMENT ON COLUMN "Course"."keyBenefits" IS 'Array of key selling points for marketing';
COMMENT ON COLUMN "Course"."careerOutcomes" IS 'Array of job titles/career paths students can achieve';
COMMENT ON COLUMN "Course"."features" IS 'Array of course feature objects with name, description, icon';
COMMENT ON COLUMN "Course"."studentCount" IS 'Computed field: total enrolled students (updated by trigger)';
COMMENT ON COLUMN "Course"."averageRating" IS 'Computed field: average rating from published reviews (updated by trigger)';
COMMENT ON COLUMN "Course"."nextStartDate" IS 'Next cohort start date for course scheduling';
COMMENT ON COLUMN "Course"."enrollmentDeadline" IS 'Last day to enroll for next cohort';
COMMENT ON COLUMN "Course"."isActive" IS 'Course can be purchased/enrolled (for catalog filtering)';
COMMENT ON COLUMN "Course"."isFeatured" IS 'Course is featured in catalog (for priority display)';

-- Migration verification queries
-- These can be run after migration to verify data integrity

/*
-- Verify computed fields are working
SELECT 
    c."title"->>'en' as title,
    c."studentCount",
    (SELECT COUNT(*) FROM "Enrollment" WHERE "courseId" = c."id" AND "status" IN ('ACTIVE', 'COMPLETED')) as actual_count,
    c."averageRating",
    (SELECT AVG("rating") FROM "Review" WHERE "courseId" = c."id" AND "isPublished" = TRUE) as actual_rating
FROM "Course" c
WHERE c."studentCount" > 0 OR c."averageRating" IS NOT NULL;

-- Verify indexes are created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'Course' 
AND indexname LIKE '%Course_%'
ORDER BY indexname;

-- Test course catalog view
SELECT 
    "title"->>'en' as title,
    "categoryName"->>'en' as category,
    "totalStudents",
    "avgRating",
    "enrollmentStatus",
    "isUpcoming",
    "daysUntilStart"
FROM "CourseWithMetrics"
WHERE "isActive" = TRUE
ORDER BY "isFeatured" DESC, "totalStudents" DESC
LIMIT 10;
*/