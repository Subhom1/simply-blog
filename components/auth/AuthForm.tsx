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

    const inputStyle = "rounded-md relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
    const errorStyle = "text-red-500 text-sm text-center font-medium"
    const buttonStyle = "group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2  text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all duration-200"
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8">

                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            SimplyBlog
                        </span>
                    </h1>
                    

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        {mode === 'register' && (

                                <Input
                                    id="full-name"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className={inputStyle}
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                        )}

                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={inputStyle}
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={mode === 'login' ? "current-password" : "new-password"}
                                required
                                className={inputStyle}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                    </div>

                    {error && (
                        <div className={errorStyle}>
                            {error}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className={buttonStyle}
                        >
                            {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign in' : 'Create account')}
                        </Button>
                        <p className="mt-5 text-sm text-gray-600 text-center">
                        {mode === 'login' ? 'Don\'t have an account? ' : 'Already have an account? '}
                        <Link
                            href={mode === 'login' ? '/register' : '/login'}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </Link>
                    </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
