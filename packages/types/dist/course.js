/**
 * Course-related type definitions
 * Updated to match Prisma schema v2.0 - Extended course catalog system
 */
// Enums matching Prisma schema
export var CourseFormat;
(function (CourseFormat) {
    CourseFormat["ONLINE"] = "ONLINE";
    CourseFormat["HYBRID"] = "HYBRID";
    CourseFormat["IN_PERSON"] = "IN_PERSON";
})(CourseFormat || (CourseFormat = {}));
export var CourseLevel;
(function (CourseLevel) {
    CourseLevel["BEGINNER"] = "BEGINNER";
    CourseLevel["INTERMEDIATE"] = "INTERMEDIATE";
    CourseLevel["ADVANCED"] = "ADVANCED";
    CourseLevel["EXPERT"] = "EXPERT";
})(CourseLevel || (CourseLevel = {}));
export var CourseStatus;
(function (CourseStatus) {
    CourseStatus["DRAFT"] = "DRAFT";
    CourseStatus["PUBLISHED"] = "PUBLISHED";
    CourseStatus["ARCHIVED"] = "ARCHIVED";
})(CourseStatus || (CourseStatus = {}));
export var Locale;
(function (Locale) {
    Locale["EN"] = "EN";
    Locale["RU"] = "RU";
    Locale["HE"] = "HE";
})(Locale || (Locale = {}));
export var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["ACTIVE"] = "ACTIVE";
    EnrollmentStatus["PAUSED"] = "PAUSED";
    EnrollmentStatus["COMPLETED"] = "COMPLETED";
    EnrollmentStatus["EXPIRED"] = "EXPIRED";
    EnrollmentStatus["CANCELLED"] = "CANCELLED";
})(EnrollmentStatus || (EnrollmentStatus = {}));
//# sourceMappingURL=course.js.map