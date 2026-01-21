'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { fetchBlogById } from '@/utils/api-services/blog'
import { setCurrentBlog, setLoading, setError } from '@/utils/redux/blogSlice'
import Header from '@/components/header/Header'
import Button from '@/components/ui/button'

export default function BlogViewPage() {
    const { id } = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { currentBlog, loading, error } = useAppSelector((state) => state.blog)

    useEffect(() => {
        if (!id) return

        const loadBlog = async () => {
            dispatch(setLoading(true))
            try {
                const blog = await fetchBlogById(id as string)
                dispatch(setCurrentBlog(blog))
            } catch (err: any) {
                dispatch(setError(err.message))
            }
        }

        loadBlog()

        // Cleanup
        return () => {
            dispatch(setCurrentBlog(null))
        }
    }, [id, dispatch])

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    if (error || !currentBlog) {
        return (
            <div className="min-h-screen bg-white dark:bg-black">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blog Post Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">{error || "The blog post you're looking for doesn't exist."}</p>
                    <Button onClick={() => router.push('/')}>Go Back Home</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
            <Header />

            <article>
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                    <img
                        src={currentBlog.image_url || 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1200'}
                        alt={currentBlog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                                {currentBlog.title}
                            </h1>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                                    {currentBlog.user?.avatar_url ? (
                                        <img src={currentBlog.user.avatar_url} alt={currentBlog.user.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white">
                                            {currentBlog.user?.full_name?.charAt(0) || 'A'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">
                                        {currentBlog.user?.full_name || 'Anonymous'}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        Published on {new Date(currentBlog.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-xl">
                            {currentBlog.content}
                        </p>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <Button
                            onClick={() => router.push('/')}
                            className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Stories
                        </Button>
                    </div>
                </div>
            </article>
        </div>
    )
}
