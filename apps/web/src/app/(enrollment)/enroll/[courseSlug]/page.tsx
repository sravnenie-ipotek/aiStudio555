import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface EnrollPageProps {
  params: {
    courseSlug: string
  }
}

export async function generateMetadata({ params }: EnrollPageProps): Promise<Metadata> {
  return {
    title: `Enroll in ${params.courseSlug.replace(/-/g, ' ')}`,
    description: 'Start your enrollment process',
  }
}

export default function EnrollPage({ params }: EnrollPageProps) {
  // Redirect to step 1 of enrollment
  redirect(`/enroll/${params.courseSlug}/step-1-info`)
}