import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface EnrollPageProps {
  params: Promise<{
    courseSlug: string
  }>
}

export async function generateMetadata({ params }: EnrollPageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  return {
    title: `Enroll in ${courseSlug.replace(/-/g, ' ')}`,
    description: 'Start your enrollment process',
  }
}

export default async function EnrollPage({ params }: EnrollPageProps) {
  const { courseSlug } = await params;
  // Redirect to step 1 of enrollment
  redirect(`/enroll/${courseSlug}/step-1-info`)
}