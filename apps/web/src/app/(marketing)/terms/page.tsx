import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Projectdes AI Academy',
  description: 'Terms and conditions for using Projectdes AI Academy\'s educational platform and services. Your rights and responsibilities as a student.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              These terms govern your use of Projectdes AI Academy's educational platform and services. 
              Please read them carefully before enrolling in any course.
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
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-yellow-900 mb-3 mt-0">Agreement Overview</h2>
              <p className="text-yellow-800 mb-0">
                By using our platform or enrolling in our courses, you agree to these terms. 
                We're committed to providing high-quality AI education while protecting both your rights and ours.
              </p>
            </div>

            <h2>1. Acceptance of Terms</h2>
            
            <p>
              By accessing or using Projectdes AI Academy's services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, please do not use our services.
            </p>

            <p>
              These terms apply to all users, including students, instructors, partners, and visitors to our platform.
            </p>

            <h2>2. Description of Services</h2>
            
            <h3>Educational Platform</h3>
            <p>
              Projectdes AI Academy provides online education services focused on AI transformation training, including:
            </p>
            <ul>
              <li>Interactive online courses and learning materials</li>
              <li>Live virtual classrooms and mentoring sessions</li>
              <li>Project-based learning experiences</li>
              <li>Career placement and professional development services</li>
              <li>Community forums and peer learning opportunities</li>
            </ul>

            <h3>Service Availability</h3>
            <p>
              We strive to maintain 99.9% uptime for our platform, but we cannot guarantee uninterrupted service. 
              We may temporarily suspend services for maintenance, updates, or technical issues.
            </p>

            <h2>3. Registration and Accounts</h2>
            
            <h3>Account Requirements</h3>
            <ul>
              <li>You must be at least 18 years old to create an account</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h3>Account Responsibilities</h3>
            <ul>
              <li>One account per person (sharing accounts is prohibited)</li>
              <li>Keep your profile information current and accurate</li>
              <li>Use your real name and professional information</li>
              <li>Respect other learners and maintain professional conduct</li>
            </ul>

            <h2>4. Course Enrollment and Payments</h2>
            
            <h3>Course Access</h3>
            <ul>
              <li>Course access begins upon successful payment processing</li>
              <li>You have lifetime access to completed course materials unless otherwise specified</li>
              <li>Course schedules and content are subject to reasonable changes</li>
              <li>Prerequisites must be met before enrolling in advanced courses</li>
            </ul>

            <h3>Payment Terms</h3>
            <ul>
              <li>All payments are processed securely through Stripe</li>
              <li>Prices are subject to change with reasonable notice</li>
              <li>Installment plans are available for qualified students</li>
              <li>Currency conversion rates may apply for international payments</li>
            </ul>

            <h3>Refund Policy</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="font-semibold text-blue-900 mb-2">30-Day Money-Back Guarantee</p>
              <ul className="text-blue-800 space-y-1 mb-0">
                <li>Full refund available within 30 days of enrollment</li>
                <li>Must complete less than 25% of course content</li>
                <li>Refund processed within 5-10 business days</li>
                <li>Contact support@projectdes-academy.com to request a refund</li>
              </ul>
            </div>

            <h2>5. Intellectual Property Rights</h2>
            
            <h3>Our Content</h3>
            <p>
              All course materials, including videos, documents, code examples, and assessments, are owned by 
              Projectdes AI Academy or our licensed content providers. This content is protected by copyright, 
              trademark, and other intellectual property laws.
            </p>

            <h3>Your License</h3>
            <p>
              We grant you a personal, non-exclusive, non-transferable license to access and use our educational 
              content for your own learning purposes. You may not:
            </p>
            <ul>
              <li>Redistribute, share, or resell course materials</li>
              <li>Create derivative works from our content</li>
              <li>Use content for commercial purposes without permission</li>
              <li>Remove copyright notices or proprietary markings</li>
            </ul>

            <h3>Your Content</h3>
            <p>
              When you submit projects, participate in forums, or create content on our platform, you retain ownership 
              but grant us a license to use, display, and share your content for educational and promotional purposes.
            </p>

            <h2>6. Code of Conduct</h2>
            
            <h3>Professional Standards</h3>
            <p>
              All users must maintain professional conduct and respect for others. Prohibited behaviors include:
            </p>
            <ul>
              <li>Harassment, discrimination, or inappropriate communication</li>
              <li>Sharing false or misleading information</li>
              <li>Attempting to cheat or circumvent course requirements</li>
              <li>Disrupting learning environments or discussions</li>
              <li>Violating intellectual property rights</li>
            </ul>

            <h3>Academic Integrity</h3>
            <ul>
              <li>Complete all assignments and projects using your own work</li>
              <li>Properly attribute any external sources or collaborations</li>
              <li>Do not share answers or solutions with other students</li>
              <li>Report suspected violations to course instructors</li>
            </ul>

            <h2>7. Job Placement Services</h2>
            
            <h3>Placement Guarantee</h3>
            <p>
              We offer job placement assistance to qualifying graduates, including:
            </p>
            <ul>
              <li>Resume review and optimization</li>
              <li>Interview preparation and coaching</li>
              <li>Introduction to partner employers</li>
              <li>Ongoing career support and networking opportunities</li>
            </ul>

            <h3>Guarantee Conditions</h3>
            <ul>
              <li>Must successfully complete all required course modules</li>
              <li>Maintain active participation in career services programs</li>
              <li>Meet eligibility requirements for target job markets</li>
              <li>Demonstrate professional readiness and communication skills</li>
            </ul>

            <h2>8. Privacy and Data Protection</h2>
            
            <p>
              Your privacy is important to us. Please review our <a href="/privacy" className="text-primary-blue hover:text-blue-700">Privacy Policy</a> 
              for detailed information about how we collect, use, and protect your personal information.
            </p>

            <h3>Learning Analytics</h3>
            <p>
              We collect and analyze learning data to improve our courses and provide personalized recommendations. 
              This data is used solely for educational purposes and is never sold to third parties.
            </p>

            <h2>9. Disclaimers and Limitations</h2>
            
            <h3>Educational Services</h3>
            <p>
              While we strive to provide high-quality education, we cannot guarantee specific career outcomes or 
              employment results. Your success depends on various factors including your effort, market conditions, 
              and individual circumstances.
            </p>

            <h3>Technical Limitations</h3>
            <ul>
              <li>Platform availability may be affected by maintenance or technical issues</li>
              <li>Internet connectivity and device compatibility may affect your experience</li>
              <li>We are not responsible for data loss due to technical failures</li>
              <li>Third-party integrations may have their own limitations and terms</li>
            </ul>

            <h3>Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, Projectdes AI Academy's liability is limited to the amount 
              you paid for the specific service that gave rise to the claim.
            </p>

            <h2>10. Termination</h2>
            
            <h3>Your Right to Terminate</h3>
            <ul>
              <li>You may deactivate your account at any time</li>
              <li>Downloaded materials may continue to be used according to license terms</li>
              <li>Refunds are subject to our refund policy terms</li>
            </ul>

            <h3>Our Right to Terminate</h3>
            <p>
              We may suspend or terminate your account for violations of these terms, including:
            </p>
            <ul>
              <li>Violation of our code of conduct</li>
              <li>Fraudulent or illegal activity</li>
              <li>Repeated policy violations</li>
              <li>Non-payment of fees</li>
            </ul>

            <h2>11. Governing Law and Disputes</h2>
            
            <h3>Jurisdiction</h3>
            <p>
              These terms are governed by the laws of [Jurisdiction], without regard to conflict of law principles. 
              Any disputes will be resolved through binding arbitration or in the courts of [Jurisdiction].
            </p>

            <h3>Dispute Resolution</h3>
            <p>
              Before pursuing formal legal action, we encourage you to contact our support team to resolve any issues. 
              Most problems can be resolved quickly through direct communication.
            </p>

            <h2>12. Changes to Terms</h2>
            
            <p>
              We may update these terms to reflect changes in our services or legal requirements. We will notify you of 
              significant changes via email or platform notifications. Continued use of our services after changes 
              constitutes acceptance of the new terms.
            </p>

            <h2>13. Contact Information</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 not-prose">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Legal and Support Contact</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>General Support:</strong> support@projectdes-academy.com</p>
                <p><strong>Legal Questions:</strong> legal@projectdes-academy.com</p>
                <p><strong>Billing Issues:</strong> billing@projectdes-academy.com</p>
                <p><strong>Academic Integrity:</strong> integrity@projectdes-academy.com</p>
                <p><strong>Response Time:</strong> Within 2 business days</p>
              </div>
            </div>

            <div className="bg-primary-yellow/10 border border-primary-yellow/20 rounded-2xl p-6 not-prose mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Thank You for Choosing Projectdes AI Academy</h3>
              <p className="text-gray-700 mb-0">
                These terms exist to protect both you and us while ensuring a positive learning experience for everyone. 
                If you have questions about any of these terms, please don't hesitate to reach out to our support team.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}