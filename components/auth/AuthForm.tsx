'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input/input'
import Button from '@/components/ui/button'

interface AuthFormProps {
    mode: 'login' | 'register'
    loading: boolean
    error?: string | null
    onSubmit: (data: any) => void
}

export default function AuthForm({ mode, loading, error, onSubmit }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ email, password, fullName })
    }

    const inputStyle = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all backdrop-blur-sm"
    const errorStyle = "text-red-500 text-sm text-center font-semibold bg-red-50 dark:bg-red-900/20 py-2 rounded-lg border border-red-100 dark:border-red-800"
    const buttonStyle = "cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/40 active:scale-95 w-full flex justify-center items-center gap-2"

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-pink-100 dark:from-purple-900/10 dark:via-black dark:to-pink-900/10 transition-colors duration-500">
            {/* Background Decorative Elements */}
            <div className="fixed top-20 right-[10%] w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-20 left-[10%] w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="w-full max-w-md space-y-8 relative">
                <div className="text-center">
                    <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
                        <h1 className="text-5xl font-black tracking-tighter mb-2">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                SimplyBlog
                            </span>
                        </h1>
                    </Link>

                </div>

                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 transition-all">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {mode === 'register' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                    <Input
                                        id="full-name"
                                        name="fullName"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className={inputStyle}
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                <Input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={inputStyle}
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Password</label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={mode === 'login' ? "current-password" : "new-password"}
                                    required
                                    className={inputStyle}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className={errorStyle}>
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className={buttonStyle}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        {mode === 'login' ? 'Signing in...' : 'Registering...'}
                                    </>
                                ) : (
                                    mode === 'login' ? 'Sign in' : 'Create Account'
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <Link
                                href={mode === 'login' ? '/register' : '/login'}
                                className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                            >
                                {mode === 'login' ? 'Sign up' : 'Sign in'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
