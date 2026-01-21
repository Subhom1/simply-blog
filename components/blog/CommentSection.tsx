'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { fetchBlogCommentsByPostId } from '@/utils/api-services/blog'
import { setBlogComments } from '@/utils/redux/blogSlice'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

export default function CommentSection() {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const { comments } = useAppSelector((state) => state.blog)

    const fetchComments = async () => {
        try {
            const data = await fetchBlogCommentsByPostId(id as string)
            dispatch(setBlogComments(data))
        } catch (err: any) {
            console.error('Error loading comments:', err)
        }
    }

    useEffect(() => {
        if (id) fetchComments()
    }, [id, dispatch])

    return (
        <section className="mt-20 pt-16 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Responses</h3>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-bold text-gray-600 dark:text-gray-400">
                    {comments.length}
                </span>
            </div>

            <div className="mb-12">
                <CommentForm postId={id as string} />
            </div>

            <CommentList comments={comments} onRefresh={fetchComments} />
        </section>
    )
}
