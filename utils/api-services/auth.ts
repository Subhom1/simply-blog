import { createClient } from '@/utils/supabase/client'
import { User } from '@/types'

const supabase = createClient()

interface AuthResponse {
    user: User | null
    error: string | null
}

export const authService = {
    // Handling user login
    async login(email: string, password: string): Promise<AuthResponse> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return { user: null, error: error.message }
        }

        if (data.user) {
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: data.user.user_metadata.full_name,
                    avatar_url: data.user.user_metadata.avatar_url
                },
                error: null
            }
        }

        return { user: null, error: 'Unknown error occurred' }
    },
    // Handling user registration
    async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (error) {
            return { user: null, error: error.message }
        }

        if (data.user) {
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: fullName,
                },
                error: null
            }
        }
        return { user: null, error: 'Registration successful. Please check your email.' }
    },
    // Handling user logout
    async logout(): Promise<{ error: string | null }> {
        const { error } = await supabase.auth.signOut()
        return { error: error ? error.message : null }
    },

    async getCurrentUser(): Promise<User | null> {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return null
        }

        return {
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url
        }
    }
}

