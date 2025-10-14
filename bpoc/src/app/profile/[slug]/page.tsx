import { redirect } from 'next/navigation'

export default async function ProfileBySlugPage({ params }: { params: Promise<{ slug: string }> }) {
	// Redirect to the main slug page which now only handles profiles
	const { slug } = await params
	redirect(`/${slug}`)
}
