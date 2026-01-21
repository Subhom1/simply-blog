import React, { useState } from 'react'
import { BlogComment } from '@/types'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { useRouter } from 'next/navigation'
import { deleteBlogComment } from '@/utils/api-services/blog'
import { deleteBlogCommentFromState } from '@/utils/redux/blogSlice'
import Button from '@/components/ui/button'

interface CommentListProps {
    comments: BlogComment[]
    onRefresh?: () => void | Promise<void>
}

export default function CommentList({ comments, onRefresh }: CommentListProps) {
    const { user } = useAppSelector((state) => state.auth)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Are you sure you want to remove this comment?')) return

        setDeletingId(commentId)
        try {
            await deleteBlogComment(commentId)
            dispatch(deleteBlogCommentFromState(commentId))
            router.refresh()
            if (onRefresh) onRefresh()
        } catch (err: any) {
            alert('Failed to delete comment: ' + err.message)
        } finally {
            setDeletingId(null)
        }
    }

    if (comments.length === 0) {
        return (
            <div className="py-10 text-center">
                <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        {comment.user?.avatar_url ? (
                            <img src={comment.user.avatar_url} alt={comment.user.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                {comment.user?.full_name?.charAt(0) || 'A'}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-gray-900 dark:text-white">{comment.user?.full_name || 'Anonymous'}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(comment.created_at).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            {user?.id === comment.author_id && (
                                <Button
                                    onClick={() => handleDelete(comment.id)}
                                    disabled={deletingId === comment.id}
                                    className="ml-auto text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400/70 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                >
                                    {deletingId === comment.id ? 'Deleting...' : 'Delete'}
                                </Button>
                            )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
