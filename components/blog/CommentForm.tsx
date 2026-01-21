'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/utils/hooks'
import { addBlogComment } from '@/utils/api-services/blog'
import { addBlogCommentToState } from '@/utils/redux/blogSlice'

interface CommentFormProps {
    postId: string
}

export default function CommentForm({ postId }: CommentFormProps) {
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !content.trim()) return

        setIsSubmitting(true)
        try {
            const newComment = await addBlogComment(postId, user.id, content)
            dispatch(addBlogCommentToState(newComment))
            setContent('')
        } catch (err: any) {
            alert('Failed to add comment: ' + err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
                <p className="text-gray-600 dark:text-gray-400 mb-2">Want to join the conversation?</p>
                <Button onClick={() => window.location.href = '/login'} className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                    Log in to leave a comment
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts on this story..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all min-h-[120px] resize-none"
                required
            />
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
            </div>
        </form>
    )
}
