'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAppDispatch } from '@/utils/hooks'
import { setUser } from '@/utils/redux/authSlice'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch()
    const supabase = createClient()

    useEffect(() => {
        // Initial session check
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                dispatch(setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    full_name: session.user.user_metadata.full_name,
                    avatar_url: session.user.user_metadata.avatar_url
                }))
            } else {
                dispatch(setUser(null))
            }
        }

        checkUser()

        // Listen for auth changes (login, logout, token refresh, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                dispatch(setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    full_name: session.user.user_metadata.full_name,
                    avatar_url: session.user.user_metadata.avatar_url
                }))
            } else {
                dispatch(setUser(null))
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [dispatch, supabase.auth])

    return <>{children}</>
}
