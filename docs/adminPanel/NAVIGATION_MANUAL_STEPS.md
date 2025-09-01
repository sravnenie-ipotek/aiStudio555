# Manual Steps Required in Strapi Admin Panel

## ✅ What We've Done Automatically:
1. Created Navigation single type structure
2. Created MenuItem, DropdownItem, and CTAButton components
3. Added getNavigation() method to strapi-client.ts
4. Strapi is running and ready

## 🔴 What You Need to Do Manually:

### 1. Access Strapi Admin
Go to: http://localhost:1337/admin

### 2. Navigate to Content Manager
In the left sidebar, click on **Content Manager**

### 3. Find Navigation (Single Type)
Under "SINGLE TYPES", you should see **Navigation**

### 4. Add Navigation Content

Click on Navigation and add the following data:

#### Header Menu Items:

**Item 1 - Courses:**
- titleKey: `nav.courses`
- labelRu: `Курсы`
- labelEn: `Courses`
- labelHe: `קורסים`
- url: `/courses`
- order: `1`
- hasDropdown: `false`
- isActive: `true`

**Item 2 - Monthly Starts:**
- titleKey: `nav.monthlyStarts`
- labelRu: `Старты месяца`
- labelEn: `Monthly Starts`
- labelHe: `התחלות חודשיות`
- url: `/monthly-starts`
- order: `2`
- hasDropdown: `false`
- isActive: `true`

**Item 3 - Instructors:**
- titleKey: `nav.instructors`
- labelRu: `Преподаватели`
- labelEn: `Instructors`
- labelHe: `מדריכים`
- url: `/instructors`
- order: `3`
- hasDropdown: `false`
- isActive: `true`

**Item 4 - Blog:**
- titleKey: `nav.blog`
- labelRu: `Блог`
- labelEn: `Blog`
- labelHe: `בלוג`
- url: `/blog`
- order: `4`
- hasDropdown: `false`
- isActive: `true`

**Item 5 - About School:**
- titleKey: `nav.aboutSchool`
- labelRu: `О школе`
- labelEn: `About School`
- labelHe: `אודות בית הספר`
- url: `/about`
- order: `5`
- hasDropdown: `true`
- isActive: `true`

For the About School dropdown items, add:

**Dropdown Item 1:**
- titleKey: `nav.proforientation`
- labelRu: `Профориентация`
- labelEn: `Career Guidance`
- labelHe: `הכוונה מקצועית`
- url: `/career-guidance`
- order: `1`
- isActive: `true`

**Dropdown Item 2:**
- titleKey: `nav.careerCenter`
- labelRu: `Центр Карьеры`
- labelEn: `Career Center`
- labelHe: `מרכז קריירה`
- url: `/career-center`
- order: `2`
- isActive: `true`

#### CTA Button:
- textRu: `Начать обучение`
- textEn: `Start Learning`
- textHe: `התחל ללמוד`
- url: `/enroll`
- isVisible: `true`

### 5. Save and Publish
1. Click **Save** button
2. Click **Publish** button

### 6. Verify API Access
Test the API endpoint:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" http://localhost:1337/api/navigation?populate=*
```

## 🎉 Once Done:
The navigation will be fetched from Strapi and displayed on your website with full fallback support!