import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { randomString, randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Custom metrics
const loginFailRate = new Rate('login_failures');
const apiResponseTime = new Trend('api_response_time');
const enrollmentSuccess = new Rate('enrollment_success');
const paymentSuccess = new Rate('payment_success');

// Test configuration
export const options = {
  scenarios: {
    // Smoke test
    smoke: {
      executor: 'constant-vus',
      vus: 5,
      duration: '1m',
      tags: { test_type: 'smoke' },
    },
    // Load test
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },  // Ramp up to 50 users
        { duration: '5m', target: 50 },  // Stay at 50 users
        { duration: '2m', target: 100 }, // Ramp up to 100 users
        { duration: '5m', target: 100 }, // Stay at 100 users
        { duration: '2m', target: 0 },   // Ramp down to 0 users
      ],
      startTime: '2m',
      tags: { test_type: 'load' },
    },
    // Stress test
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '10m', target: 0 },
      ],
      startTime: '18m',
      tags: { test_type: 'stress' },
    },
    // Spike test
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 0 },
        { duration: '10s', target: 500 },  // Spike to 500 users
        { duration: '3m', target: 500 },   // Stay at 500 users
        { duration: '10s', target: 0 },
      ],
      startTime: '40m',
      tags: { test_type: 'spike' },
    },
  },
  thresholds: {
    // HTTP thresholds
    http_req_duration: ['p(95)<500', 'p(99)<1500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'], // Error rate must be below 10%
    
    // Custom thresholds
    login_failures: ['rate<0.05'], // Login failure rate below 5%
    api_response_time: ['p(95)<300'], // API response time 95th percentile below 300ms
    enrollment_success: ['rate>0.95'], // Enrollment success rate above 95%
    payment_success: ['rate>0.98'], // Payment success rate above 98%
    
    // Specific endpoint thresholds
    'http_req_duration{endpoint:login}': ['p(95)<200'],
    'http_req_duration{endpoint:courses}': ['p(95)<300'],
    'http_req_duration{endpoint:enrollment}': ['p(95)<400'],
    'http_req_duration{endpoint:payment}': ['p(95)<600'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000/api';

// Test data
const testUsers = [
  { email: 'test1@example.com', password: 'Test123!@#' },
  { email: 'test2@example.com', password: 'Test123!@#' },
  { email: 'test3@example.com', password: 'Test123!@#' },
];

const courseIds = [
  'ai-manager',
  'no-code',
  'ai-video',
];

// Helper functions
function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

function handleResponse(response, successRate, name) {
  const success = check(response, {
    [`${name} - status 200/201`]: (r) => r.status === 200 || r.status === 201,
    [`${name} - response time < 500ms`]: (r) => r.timings.duration < 500,
  });
  
  if (successRate) {
    successRate.add(success);
  }
  
  apiResponseTime.add(response.timings.duration);
  
  return success;
}

// Test scenarios
export default function () {
  // Randomly select test type
  const testType = randomItem(['auth', 'browse', 'enrollment', 'full']);
  
  switch (testType) {
    case 'auth':
      authenticationFlow();
      break;
    case 'browse':
      browsingFlow();
      break;
    case 'enrollment':
      enrollmentFlow();
      break;
    case 'full':
      fullUserJourney();
      break;
  }
  
  sleep(1);
}

function authenticationFlow() {
  group('Authentication Flow', () => {
    // Registration
    const registerPayload = {
      email: `user_${randomString(8)}@example.com`,
      password: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User',
    };
    
    const registerRes = http.post(
      `${BASE_URL}/auth/register`,
      JSON.stringify(registerPayload),
      { 
        headers: { 'Content-Type': 'application/json' },
        tags: { endpoint: 'register' },
      }
    );
    
    handleResponse(registerRes, null, 'Registration');
    
    // Login
    const loginPayload = {
      email: randomItem(testUsers).email,
      password: randomItem(testUsers).password,
    };
    
    const loginRes = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify(loginPayload),
      { 
        headers: { 'Content-Type': 'application/json' },
        tags: { endpoint: 'login' },
      }
    );
    
    const loginSuccess = handleResponse(loginRes, null, 'Login');
    loginFailRate.add(!loginSuccess);
    
    if (loginSuccess && loginRes.json('data.accessToken')) {
      const token = loginRes.json('data.accessToken');
      
      // Get user profile
      const profileRes = http.get(
        `${BASE_URL}/users/profile`,
        { 
          headers: getAuthHeaders(token),
          tags: { endpoint: 'profile' },
        }
      );
      
      handleResponse(profileRes, null, 'Profile');
      
      // Logout
      const logoutRes = http.post(
        `${BASE_URL}/auth/logout`,
        null,
        { 
          headers: getAuthHeaders(token),
          tags: { endpoint: 'logout' },
        }
      );
      
      handleResponse(logoutRes, null, 'Logout');
    }
  });
}

function browsingFlow() {
  group('Course Browsing Flow', () => {
    // Get all courses
    const coursesRes = http.get(
      `${BASE_URL}/courses`,
      { tags: { endpoint: 'courses' } }
    );
    
    handleResponse(coursesRes, null, 'Courses List');
    
    // Get course details
    const courseId = randomItem(courseIds);
    const courseRes = http.get(
      `${BASE_URL}/courses/${courseId}`,
      { tags: { endpoint: 'course_detail' } }
    );
    
    handleResponse(courseRes, null, 'Course Detail');
    
    // Search courses
    const searchRes = http.get(
      `${BASE_URL}/courses?search=AI&category=technology`,
      { tags: { endpoint: 'search' } }
    );
    
    handleResponse(searchRes, null, 'Course Search');
  });
}

function enrollmentFlow() {
  group('Enrollment Flow', () => {
    // Login first
    const loginPayload = {
      email: randomItem(testUsers).email,
      password: randomItem(testUsers).password,
    };
    
    const loginRes = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify(loginPayload),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    if (loginRes.status === 200 && loginRes.json('data.accessToken')) {
      const token = loginRes.json('data.accessToken');
      const courseId = randomItem(courseIds);
      
      // Enroll in course
      const enrollRes = http.post(
        `${BASE_URL}/courses/${courseId}/enroll`,
        null,
        { 
          headers: getAuthHeaders(token),
          tags: { endpoint: 'enrollment' },
        }
      );
      
      const enrollSuccess = handleResponse(enrollRes, enrollmentSuccess, 'Enrollment');
      
      if (enrollSuccess) {
        // Get enrollments
        const myCoursesRes = http.get(
          `${BASE_URL}/courses/enrollments/my`,
          { 
            headers: getAuthHeaders(token),
            tags: { endpoint: 'my_courses' },
          }
        );
        
        handleResponse(myCoursesRes, null, 'My Courses');
        
        // Update progress
        const progressRes = http.post(
          `${BASE_URL}/courses/${courseId}/lessons/lesson-1/progress`,
          JSON.stringify({ completed: true, timeSpent: 300 }),
          { 
            headers: getAuthHeaders(token),
            tags: { endpoint: 'progress' },
          }
        );
        
        handleResponse(progressRes, null, 'Progress Update');
      }
    }
  });
}

function fullUserJourney() {
  group('Full User Journey', () => {
    // Register new user
    const email = `user_${randomString(8)}@example.com`;
    const registerPayload = {
      email,
      password: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User',
    };
    
    const registerRes = http.post(
      `${BASE_URL}/auth/register`,
      JSON.stringify(registerPayload),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    if (registerRes.status === 201 && registerRes.json('data.accessToken')) {
      const token = registerRes.json('data.accessToken');
      const courseId = randomItem(courseIds);
      
      // Browse courses
      http.get(`${BASE_URL}/courses`, { 
        headers: getAuthHeaders(token),
        tags: { endpoint: 'courses' },
      });
      
      sleep(0.5);
      
      // View course details
      http.get(`${BASE_URL}/courses/${courseId}`, { 
        headers: getAuthHeaders(token),
        tags: { endpoint: 'course_detail' },
      });
      
      sleep(0.5);
      
      // Create payment session
      const paymentRes = http.post(
        `${BASE_URL}/payments/stripe/checkout`,
        JSON.stringify({ courseId }),
        { 
          headers: getAuthHeaders(token),
          tags: { endpoint: 'payment' },
        }
      );
      
      const paymentOk = handleResponse(paymentRes, paymentSuccess, 'Payment');
      
      if (paymentOk) {
        // Simulate successful enrollment after payment
        const enrollRes = http.post(
          `${BASE_URL}/courses/${courseId}/enroll`,
          null,
          { 
            headers: getAuthHeaders(token),
            tags: { endpoint: 'enrollment' },
          }
        );
        
        handleResponse(enrollRes, enrollmentSuccess, 'Post-Payment Enrollment');
        
        // Access dashboard
        const dashboardRes = http.get(
          `${BASE_URL}/users/profile`,
          { 
            headers: getAuthHeaders(token),
            tags: { endpoint: 'dashboard' },
          }
        );
        
        handleResponse(dashboardRes, null, 'Dashboard');
      }
    }
  });
}

// Lifecycle hooks
export function setup() {
  console.log('Setting up test environment...');
  
  // Create test users if needed
  testUsers.forEach(user => {
    http.post(
      `${BASE_URL}/auth/register`,
      JSON.stringify({
        ...user,
        firstName: 'Test',
        lastName: 'User',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });
  
  return { startTime: new Date() };
}

export function teardown(data) {
  console.log(`Test completed. Duration: ${new Date() - data.startTime}ms`);
}

export function handleSummary(data) {
  return {
    'stdout': JSON.stringify(data, null, 2),
    'summary.json': JSON.stringify(data),
    'summary.html': htmlReport(data),
  };
}

function htmlReport(data) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>K6 Load Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .header { background: #FFDA17; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .pass { color: green; }
        .fail { color: red; }
        .warn { color: orange; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f0f0f0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Load Test Results - Projectdes AI Academy</h1>
        <p>Test Duration: ${data.state.testRunDurationMs}ms</p>
        <p>Total Requests: ${data.metrics.http_reqs.values.count}</p>
    </div>
    
    <div class="metric">
        <h2>Request Metrics</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>Request Duration (p95)</td>
                <td>${data.metrics.http_req_duration.values['p(95)']}ms</td>
                <td class="${data.metrics.http_req_duration.values['p(95)'] < 500 ? 'pass' : 'fail'}">
                    ${data.metrics.http_req_duration.values['p(95)'] < 500 ? '✓' : '✗'}
                </td>
            </tr>
            <tr>
                <td>Request Failure Rate</td>
                <td>${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%</td>
                <td class="${data.metrics.http_req_failed.values.rate < 0.1 ? 'pass' : 'fail'}">
                    ${data.metrics.http_req_failed.values.rate < 0.1 ? '✓' : '✗'}
                </td>
            </tr>
            <tr>
                <td>Requests per Second</td>
                <td>${data.metrics.http_reqs.values.rate.toFixed(2)}</td>
                <td class="pass">✓</td>
            </tr>
        </table>
    </div>
    
    <div class="metric">
        <h2>Custom Metrics</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>Login Success Rate</td>
                <td>${((1 - data.metrics.login_failures.values.rate) * 100).toFixed(2)}%</td>
                <td class="${data.metrics.login_failures.values.rate < 0.05 ? 'pass' : 'fail'}">
                    ${data.metrics.login_failures.values.rate < 0.05 ? '✓' : '✗'}
                </td>
            </tr>
            <tr>
                <td>Enrollment Success Rate</td>
                <td>${(data.metrics.enrollment_success.values.rate * 100).toFixed(2)}%</td>
                <td class="${data.metrics.enrollment_success.values.rate > 0.95 ? 'pass' : 'fail'}">
                    ${data.metrics.enrollment_success.values.rate > 0.95 ? '✓' : '✗'}
                </td>
            </tr>
            <tr>
                <td>Payment Success Rate</td>
                <td>${(data.metrics.payment_success.values.rate * 100).toFixed(2)}%</td>
                <td class="${data.metrics.payment_success.values.rate > 0.98 ? 'pass' : 'fail'}">
                    ${data.metrics.payment_success.values.rate > 0.98 ? '✓' : '✗'}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
  `;
}