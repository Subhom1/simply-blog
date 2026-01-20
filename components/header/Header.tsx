'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { logout as logoutRedux } from '@/utils/redux/authSlice'
import { authService } from '@/utils/api-services/auth'
import Button from '@/components/ui/button'

export default function Header() {
    const user = useAppSelector((state) => state.auth.user)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const handleLogout = async () => {
        const { error } = await authService.logout()
        if (!error) {
            dispatch(logoutRedux())
            router.push('/login')
        }
    }

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            SimplyBlog
                        </span>
                    </Link>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {user && (
                            <>
                                <span className="text-sm text-gray-600 hidden sm:block">
                                    Welcome, <span className="font-semibold text-gray-900">{user.full_name || user.email}</span>
                                </span>
                                <Button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
