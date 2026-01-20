'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { setUser, setLoading, setError } from '@/utils/redux/authSlice'
import AuthForm from '@/components/auth/AuthForm'
import { authService } from '@/utils/api-services/auth'

export default function Login() {
    const [localLoading, setLocalLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const auth = useAppSelector((state) => state.auth)
    const router = useRouter()
    const dispatch = useAppDispatch()

    const handleLogin = async (data: any) => {
        setLocalLoading(true)
        setErrorMsg(null)
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const response = await authService.login(data.email, data.password)
            if (response.error) {
                throw new Error(response.error)
            }
        } catch (error: any) {
            setErrorMsg(error.message)
            dispatch(setError(error.message))
        } finally {
            setLocalLoading(false)
            dispatch(setLoading(false))
        }
    }

    useEffect(() => {
        if (auth.user) {
            router.replace('/')
        }
    }, [auth.user, router])
    return (
        <AuthForm
            mode="login"
            loading={localLoading}
            error={errorMsg}
            onSubmit={handleLogin}
        />
    )
}