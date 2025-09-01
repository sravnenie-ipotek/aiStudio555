# Navigation Menu Implementation Guide

## Step 1: Create Navigation Content Type in Strapi Admin

### 1.1 Access Strapi Admin
1. Go to http://localhost:1337/admin
2. Login with your admin credentials

### 1.2 Create Single Type
1. Go to **Content-Type Builder** in sidebar
2. Click **Create new single type**
3. Name it: `Navigation`
4. Click Continue

### 1.3 Add Fields Structure

Add these fields in order:

#### A. Header Menu (Component - Repeatable)
1. Click **Add another field**
2. Select **Component**
3. Choose **Create a new component**
4. Name: `MenuItem`
5. Category: `navigation`
6. Icon: 🔗
7. Add these fields to MenuItem component:

```
Fields for MenuItem Component:
├── titleKey (Text) - Required
│   └── Short text, e.g., "nav.courses"
├── labelRu (Text) - Required
│   └── Russian label, e.g., "Курсы"
├── labelEn (Text) - Required
│   └── English label, e.g., "Courses"
├── labelHe (Text) - Optional
│   └── Hebrew label, e.g., "קורסים"
├── url (Text) - Required
│   └── Link URL, e.g., "/courses"
├── order (Number) - Required
│   └── Display order, e.g., 1, 2, 3
├── hasDropdown (Boolean) - Default: false
│   └── Whether item has dropdown menu
├── dropdownItems (Component - Repeatable) - Optional
│   └── Use same MenuItem component (nested)
└── isActive (Boolean) - Default: true
    └── Whether menu item is visible
```

8. After creating component, name the field: `headerMenu`
9. Make it repeatable

#### B. CTA Button (Component - Single)
1. Add another field
2. Select Component
3. Create new component: `CTAButton`
4. Add these fields:

```
Fields for CTAButton Component:
├── textRu (Text) - Required
│   └── e.g., "Начать обучение"
├── textEn (Text) - Required
│   └── e.g., "Start Learning"
├── textHe (Text) - Optional
│   └── e.g., "התחל ללמוד"
├── url (Text) - Required
│   └── e.g., "/enroll"
└── isVisible (Boolean) - Default: true
```

5. Name the field: `ctaButton`

#### C. Mobile Menu Settings (Optional for now)
Can be added later if needed.

### 1.4 Save and Publish
1. Click **Save**
2. Wait for server to restart

## Step 2: Add Navigation Content

### 2.1 Navigate to Content Manager
1. Go to **Content Manager** in sidebar
2. Select **Navigation** (under Single Types)

### 2.2 Add Header Menu Items

Add these menu items:

```javascript
// Item 1: Courses
{
  titleKey: "nav.courses",
  labelRu: "Курсы",
  labelEn: "Courses",
  labelHe: "קורסים",
  url: "/courses",
  order: 1,
  hasDropdown: false,
  isActive: true
}

// Item 2: Monthly Starts
{
  titleKey: "nav.monthlyStarts",
  labelRu: "Старты месяца",
  labelEn: "Monthly Starts",
  labelHe: "התחלות חודשיות",
  url: "/monthly-starts",
  order: 2,
  hasDropdown: false,
  isActive: true
}

// Item 3: Instructors
{
  titleKey: "nav.instructors",
  labelRu: "Преподаватели",
  labelEn: "Instructors",
  labelHe: "מדריכים",
  url: "/instructors",
  order: 3,
  hasDropdown: false,
  isActive: true
}

// Item 4: Blog
{
  titleKey: "nav.blog",
  labelRu: "Блог",
  labelEn: "Blog",
  labelHe: "בלוג",
  url: "/blog",
  order: 4,
  hasDropdown: false,
  isActive: true
}

// Item 5: About School
{
  titleKey: "nav.aboutSchool",
  labelRu: "О школе",
  labelEn: "About School",
  labelHe: "אודות בית הספר",
  url: "/about",
  order: 5,
  hasDropdown: true,
  isActive: true,
  dropdownItems: [
    {
      titleKey: "nav.proforientation",
      labelRu: "Профориентация",
      labelEn: "Career Guidance",
      labelHe: "הכוונה מקצועית",
      url: "/career-guidance",
      order: 1,
      isActive: true
    },
    {
      titleKey: "nav.careerCenter",
      labelRu: "Центр Карьеры",
      labelEn: "Career Center",
      labelHe: "מרכז קריירה",
      url: "/career-center",
      order: 2,
      isActive: true
    }
  ]
}
```

### 2.3 Add CTA Button
```javascript
{
  textRu: "Начать обучение",
  textEn: "Start Learning",
  textHe: "התחל ללמוד",
  url: "/enroll",
  isVisible: true
}
```

### 2.4 Save and Publish
1. Click **Save**
2. Click **Publish**

## Step 3: Enable API Access

### 3.1 API Token Already Configured! ✅
**You already have an API token in `.env.local`, so you DON'T need to enable Public access!**

The API token provides authenticated access to all content types. Your `strapi-client.ts` already uses this token:

```typescript
headers: {
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
  'Content-Type': 'application/json',
}
```

**No additional permissions needed!** The API token handles authentication.

### Alternative: If you wanted Public access (NOT RECOMMENDED)
Only if you wanted to make the API publicly accessible without authentication:
1. Go to **Settings** → **Roles** → **Public**
2. Under **Navigation**, check find
3. Save

But since you have an API token, keep it secure and use authenticated requests!

## Step 4: Update Frontend Code

### 4.1 Update Strapi Client
Update `/apps/web/src/lib/strapi-client.ts`:

```typescript
// Add to StrapiClient class
async getNavigation() {
  try {
    const response = await fetch(
      `${this.baseURL}/api/navigation?populate=*`,
      {
        headers: this.headers,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch navigation');
    }

    const data = await response.json();
    return data.data?.attributes || null;
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return null;
  }
}
```

### 4.2 Update Header Component
Update `/apps/web/src/components/header.tsx`:

```typescript
// Add to Header component
const [navigation, setNavigation] = useState(null);

useEffect(() => {
  const fetchNavigation = async () => {
    const strapiClient = new StrapiClient();
    const navData = await strapiClient.getNavigation();
    
    if (navData?.headerMenu) {
      // Transform Strapi data to match current structure
      const transformedNav = navData.headerMenu.map(item => ({
        label: item[`label${language.charAt(0).toUpperCase() + language.slice(1)}`] || item.labelRu,
        titleKey: item.titleKey,
        href: item.url,
        hasDropdown: item.hasDropdown,
        dropdownItems: item.dropdownItems?.map(subItem => ({
          label: subItem[`label${language.charAt(0).toUpperCase() + language.slice(1)}`] || subItem.labelRu,
          href: subItem.url
        })) || []
      }));
      
      setNavigation(transformedNav);
    }
  };

  fetchNavigation();
}, [language]);

// Use navigation || fallback
const menuItems = navigation || fallbackMenuItems;
```

## Step 5: Test Implementation

### 5.1 Test Checklist
- [ ] Navigate to http://localhost:3000
- [ ] Check if menu displays correctly
- [ ] Switch languages (RU/EN/HE)
- [ ] Verify fallback works if Strapi is down
- [ ] Check development indicators

### 5.2 Content Manager Test
1. Login to Strapi admin
2. Go to Navigation
3. Change a menu label (e.g., "Курсы" → "Наши Курсы")
4. Save and Publish
5. Refresh frontend - should see change immediately

## Step 6: Add Live Preview (After $45/month upgrade)

### 6.1 Configure Preview URL
1. In Strapi admin, go to Settings → Preview
2. Add preview URL: `http://localhost:3000/api/preview`
3. Enable for Navigation content type

### 6.2 Add Preview API Route
Create `/apps/web/src/app/api/preview/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Enable preview mode
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set('preview', 'true');
  return response;
}
```

## Troubleshooting

### If menu doesn't appear:
1. Check Strapi is running: http://localhost:1337/admin
2. Verify API permissions are set
3. Check browser console for errors
4. Verify navigation data is published

### If translations don't work:
1. Ensure all language fields are filled
2. Check language detection in frontend
3. Verify fallback translations are in place

### If dropdown doesn't work:
1. Check hasDropdown boolean is true
2. Verify dropdownItems are added
3. Check frontend dropdown logic

## Next Steps

After navigation is working:
1. ✅ Navigation implemented
2. 🔜 Add Courses collection
3. 🔜 Add GlobalSettings
4. 🔜 Add Translations collection

---

**Remember**: This is Phase 1, Priority 1. Keep it simple, make it work, then iterate!