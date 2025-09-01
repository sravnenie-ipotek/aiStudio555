import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Projectdes AI Academy',
  description: 'Learn how Projectdes AI Academy collects, uses, and protects your personal information. Our commitment to your privacy and data security.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your privacy and data security are fundamental to our mission. This policy explains how we collect, 
              use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg prose-gray max-w-none">
            
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-3 mt-0">Quick Summary</h2>
              <ul className="text-blue-800 mb-0 space-y-1">
                <li>We collect only necessary information to provide our educational services</li>
                <li>We never sell your personal data to third parties</li>
                <li>We use industry-standard security measures to protect your information</li>
                <li>You have full control over your data and can request deletion at any time</li>
                <li>We comply with GDPR, CCPA, and other international privacy regulations</li>
              </ul>
            </div>

            <h2>1. Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>
              When you register for our courses or use our services, we collect information such as:
            </p>
            <ul>
              <li>Name and email address</li>
              <li>Professional background and experience level</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Learning preferences and progress data</li>
              <li>Communication preferences</li>
            </ul>

            <h3>Technical Information</h3>
            <p>
              We automatically collect certain technical information to improve our services:
            </p>
            <ul>
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information and operating system</li>
              <li>Usage patterns and learning analytics</li>
              <li>Performance metrics and error logs</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            
            <h3>Educational Services</h3>
            <ul>
              <li>Deliver personalized course content and recommendations</li>
              <li>Track learning progress and provide feedback</li>
              <li>Facilitate communication with instructors and mentors</li>
              <li>Generate certificates and validate course completion</li>
            </ul>

            <h3>Platform Improvement</h3>
            <ul>
              <li>Analyze learning patterns to improve our curriculum</li>
              <li>Optimize platform performance and user experience</li>
              <li>Develop new features based on user needs</li>
              <li>Conduct research on AI education effectiveness</li>
            </ul>

            <h3>Communication</h3>
            <ul>
              <li>Send course updates and important notifications</li>
              <li>Provide technical support and customer service</li>
              <li>Share relevant AI industry insights (with your consent)</li>
              <li>Process job placement and career support services</li>
            </ul>

            <h2>3. Information Sharing</h2>
            
            <h3>We DO NOT sell your personal information</h3>
            <p>
              We may share your information only in these limited circumstances:
            </p>
            
            <h4>Service Providers</h4>
            <ul>
              <li><strong>Payment Processing:</strong> Stripe (for secure payment handling)</li>
              <li><strong>Email Services:</strong> Professional email platforms for course communications</li>
              <li><strong>Analytics:</strong> Privacy-focused analytics to understand platform usage</li>
              <li><strong>Cloud Infrastructure:</strong> Secure hosting and data storage providers</li>
            </ul>

            <h4>Employment Partners</h4>
            <p>
              With your explicit consent, we may share relevant professional information with our job placement partners 
              to help you find AI-related career opportunities.
            </p>

            <h4>Legal Requirements</h4>
            <p>
              We may disclose information when required by law or to protect our rights, users, or the public.
            </p>

            <h2>4. Data Security</h2>
            
            <h3>Technical Safeguards</h3>
            <ul>
              <li>End-to-end encryption for all data transmission</li>
              <li>Secure database storage with access controls</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Multi-factor authentication for administrative access</li>
            </ul>

            <h3>Organizational Measures</h3>
            <ul>
              <li>Employee privacy training and confidentiality agreements</li>
              <li>Strict access controls based on job responsibilities</li>
              <li>Regular privacy and security policy updates</li>
              <li>Incident response procedures for any security breaches</li>
            </ul>

            <h2>5. Your Privacy Rights</h2>
            
            <h3>Access and Control</h3>
            <ul>
              <li><strong>Access:</strong> Request a copy of all personal information we have about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Receive your data in a structured, commonly used format</li>
            </ul>

            <h3>Communication Preferences</h3>
            <ul>
              <li>Opt-out of marketing communications at any time</li>
              <li>Choose your preferred communication channels</li>
              <li>Control the frequency of course-related updates</li>
              <li>Manage cookie and tracking preferences</li>
            </ul>

            <h3>How to Exercise Your Rights</h3>
            <p>
              To exercise any of these rights, contact us at:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@projectdes-academy.com</li>
              <li><strong>Response Time:</strong> We'll respond within 30 days</li>
              <li><strong>Verification:</strong> We may need to verify your identity for security purposes</li>
            </ul>

            <h2>6. Data Retention</h2>
            
            <h3>Course Data</h3>
            <ul>
              <li>Active enrollment data: Retained during course participation</li>
              <li>Completed course records: Kept for 7 years for certification purposes</li>
              <li>Learning analytics: Anonymized after 3 years</li>
            </ul>

            <h3>Account Data</h3>
            <ul>
              <li>Account information: Retained until account deletion requested</li>
              <li>Support communications: Kept for 2 years for quality assurance</li>
              <li>Payment records: Retained as required by financial regulations</li>
            </ul>

            <h2>7. International Transfers</h2>
            
            <p>
              As a global education platform, we may transfer your information internationally. 
              We ensure appropriate safeguards through:
            </p>
            <ul>
              <li>Standard contractual clauses approved by data protection authorities</li>
              <li>Adequacy decisions recognizing equivalent privacy protection</li>
              <li>Certification schemes ensuring privacy compliance</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            
            <p>
              Our services are designed for professional adult learners. We do not knowingly collect 
              information from children under 16. If we discover we have collected such information, 
              we will delete it promptly.
            </p>

            <h2>9. Changes to This Policy</h2>
            
            <p>
              We may update this privacy policy to reflect changes in our practices or legal requirements. 
              We will:
            </p>
            <ul>
              <li>Notify you via email for significant changes</li>
              <li>Post the updated policy on our website</li>
              <li>Provide a summary of key changes</li>
              <li>Allow time for review before implementation</li>
            </ul>

            <h2>10. Contact Information</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 not-prose">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy Team Contact</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@projectdes-academy.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@projectdes-academy.com</p>
                <p><strong>Response Time:</strong> Within 30 days</p>
                <p><strong>Emergency Contact:</strong> For security incidents, contact security@projectdes-academy.com</p>
              </div>
            </div>

            <div className="bg-primary-yellow/10 border border-primary-yellow/20 rounded-2xl p-6 not-prose mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Regional Privacy Rights</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>GDPR (EU):</strong> Full rights under European data protection law</p>
                <p><strong>CCPA (California):</strong> Consumer privacy rights under California law</p>
                <p><strong>PIPEDA (Canada):</strong> Personal information protection rights</p>
                <p><strong>Other Jurisdictions:</strong> We comply with applicable local privacy laws</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}