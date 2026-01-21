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
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
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
                                <div className="flex items-center space-x-3">
                                    <Link href="/profile" className="flex items-center group">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 transition-all group-hover:border-purple-400">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 hidden sm:block group-hover:text-purple-600 transition-colors">
                                            {user.full_name || user.email}
                                        </span>
                                    </Link>
                                    <Button
                                        onClick={handleLogout}
                                        className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
