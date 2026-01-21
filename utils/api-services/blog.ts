import { createClient } from '../supabase/client'
import { BlogPost } from '@/types'

const supabase = createClient()

export const uploadImage = async (file: File, folder: string): Promise<string> => {
    console.log(`Uploading to ${folder}...`);
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('imgs')
        .upload(filePath, file)

    if (uploadError) {
        console.error('Upload Image Error:', uploadError);
        throw new Error('Failed to upload image: ' + uploadError.message)
    }

    const { data: { publicUrl } } = supabase.storage
        .from('imgs')
        .getPublicUrl(filePath)

    console.log('Upload Image Success:', publicUrl);
    return publicUrl
}

export const createBlogPost = async (blogData: {
    title: string;
    content: string;
    image_url?: string;
    author_id: string;
}): Promise<BlogPost> => {
    console.log('Create blog post request:', blogData);
    const { data, error } = await supabase
        .from('posts')
        .insert([blogData])
        .select('*, user:users(*)')
        .single()

    if (error) {
        console.error('Create blog post error:', error);
        throw new Error('Failed to create blog post: ' + error.message)
    }

    console.log('Create blog post success:', data);
    return data
}
