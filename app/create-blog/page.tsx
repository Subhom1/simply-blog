'use client'

import React, { useState } from 'react'
import Header from '@/components/header/Header'
import { useAppSelector } from '@/utils/hooks'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import { addBlog } from '@/utils/redux/blogSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { uploadImage, createBlogPost } from '@/utils/api-services/blog'

const buttonStyle = "cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/40 active:scale-95 w-full flex justify-center items-center gap-2"
const inputStyle = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"

export default function CreateBlogPage() {
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useDispatch()
    const router = useRouter()

    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isPublishing, setIsPublishing] = useState<boolean>(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            alert('Please login to create a blog')
            return
        }

        setIsPublishing(true)
        try {
            let image_url = ''

            if (image) {
                image_url = await uploadImage(image, 'blog-images')
            }

            const blogPost = await createBlogPost({
                title,
                content: description,
                image_url,
                author_id: user.id
            })

            dispatch(addBlog(blogPost))
            router.push('/')
        } catch (error: any) {
            console.error('Error creating blog:', error.message)
            alert(error.message)
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black transition-colors duration-200">
            <Header />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
                        Create New Story
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">
                                Cover Image
                            </label>
                            <div className="relative group cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                />
                                <div className={`w-full aspect-video rounded-2xl border-2 border-dashed ${imagePreview ? 'border-transparent' : 'border-gray-200 dark:border-gray-800'} flex items-center justify-center overflow-hidden transition-all group-hover:border-purple-400`}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-500">Click to upload cover image</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">
                                Title
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter a catchy title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={inputStyle}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">
                                Description
                            </label>
                            <textarea
                                placeholder="What's your story about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={`${inputStyle} min-h-[150px] resize-none`}
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className={buttonStyle} disabled={isPublishing}>
                                {isPublishing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Publishing...
                                    </>
                                ) : 'Publish Story'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
