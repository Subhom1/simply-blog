'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/header/Header'
import { useAppSelector } from '@/utils/hooks'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import { authService } from '@/utils/api-services/auth'
import { uploadImage, optimizeImage } from '@/utils/api-services/blog'
import { setUser } from '@/utils/redux/authSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

const buttonStyle = "cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/40 active:scale-95 w-full flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
const inputStyle = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"

export default function ProfilePage() {
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useDispatch()
    const router = useRouter()

    const [fullName, setFullName] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '')
            setImagePreview(user.avatar_url || null)
        } else {
            router.push('/login')
        }
    }, [user])

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
        if (!user) return

        setIsUpdating(true)
        try {
            let avatar_url = user.avatar_url || ''

            if (image) {
                const optimizedImage = await optimizeImage(image)
                avatar_url = await uploadImage(optimizedImage, 'avatars')
            }

            const { user: updatedUser, error } = await authService.updateProfile(user.id, {
                full_name: fullName,
                avatar_url
            })

            if (error) throw new Error(error)

            if (updatedUser) {
                dispatch(setUser(updatedUser))
                alert('Profile updated successfully!')
            }
        } catch (error: any) {
            console.error('Error updating profile:', error.message)
            alert('Error updating profile: ' + error.message)
        } finally {
            setIsUpdating(false)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50/50 dark:bg-black transition-colors duration-200">
                <Header />
                <main className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black transition-colors duration-200">
            <Header />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
                        My Profile
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group w-32 h-32">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                />
                                <div className={`w-full h-full rounded-full border-2 border-dashed ${imagePreview ? 'border-transparent' : 'border-gray-200 dark:border-gray-800'} flex items-center justify-center overflow-hidden transition-all group-hover:border-purple-400 bg-gray-50 dark:bg-gray-800`}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-2">
                                            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 p-1.5 bg-purple-600 rounded-full text-white shadow-lg pointer-events-none group-hover:scale-110 transition-transform">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Click to update profile photo</p>
                        </div>

                        {/* Name Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                placeholder="Your Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={inputStyle}
                                required
                            />
                        </div>

                        {/* Email Section (Read-only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                value={user.email}
                                className={`${inputStyle} opacity-50 cursor-not-allowed`}
                                disabled
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className={buttonStyle} disabled={isUpdating}>
                                {isUpdating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Updating...
                                    </>
                                ) : 'Update Profile'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
