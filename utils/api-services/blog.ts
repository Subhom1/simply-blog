import { createClient } from '../supabase/client'
import { BlogPost, User, BlogComment } from '@/types'

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

export const fetchBlogs = async (page: number = 1, pageSize: number = 6, authorId?: string): Promise<{ blogs: BlogPost[], totalCount: number }> => {
    console.log(`Fetching blogs (Page: ${page}, Size: ${pageSize}, Author: ${authorId || 'All'})...`);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Fetch blogs with pagination and optional author filter
    let query = supabase
        .from('posts')
        .select(`
            *,
            user:users (
                id,
                full_name,
                avatar_url
            )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (authorId) {
        query = query.eq('author_id', authorId)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Fetch Blogs Error:', error);
        throw new Error('Failed to fetch blogs: ' + error.message)
    }

    console.log('Fetch Blogs Success:', data.length, 'blogs found, total:', count);
    return {
        blogs: data as BlogPost[],
        totalCount: count || 0
    }
}

export const fetchBlogById = async (id: string): Promise<BlogPost> => {
    console.log(`Fetching blog with ID: ${id}...`);
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            user:users (
                id,
                full_name,
                avatar_url
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Fetch Blog Error:', error);
        throw new Error('Failed to fetch blog: ' + error.message)
    }

    return data as BlogPost
}

export const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const optimizedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(optimizedFile);
                    } else {
                        reject(new Error('Canvas toBlob failed'));
                    }
                }, 'image/jpeg', 0.8);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
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
export const updateBlogPost = async (id: string, blogData: Partial<{
    title: string;
    content: string;
    image_url?: string;
}>): Promise<BlogPost> => {
    console.log('Update blog post request:', id, blogData);
    const { data, error } = await supabase
        .from('posts')
        .update(blogData)
        .eq('id', id)
        .select('*, user:users(*)')
        .single()

    if (error) {
        console.error('Update blog post error:', error);
        throw new Error('Failed to update blog post: ' + error.message)
    }

    console.log('Update blog post success:', data);
    return data
}

export const deleteBlogPost = async (id: string): Promise<void> => {
    console.log('Delete blog post request:', id);
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete blog post error:', error);
        throw new Error('Failed to delete blog post: ' + error.message)
    }

    console.log('Delete blog post success');
}

export const fetchBlogCommentsByPostId = async (postId: string): Promise<BlogComment[]> => {
    console.log(`Fetching comments for post: ${postId}...`);
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            user:users (
                id,
                full_name,
                avatar_url
            )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Fetch comments error:', error);
        throw new Error('Failed to fetch comments: ' + error.message)
    }

    return data as (BlogComment & { user: User })[]
}

export const addBlogComment = async (postId: string, authorId: string, content: string): Promise<BlogComment> => {
    console.log('Adding comment:', { postId, authorId, content });
    const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, author_id: authorId, content }])
        .select(`
            *,
            user:users (
                id,
                full_name,
                avatar_url
            )
        `)
        .single()

    if (error) {
        console.error('Add comment error:', error);
        throw new Error('Failed to add comment: ' + error.message)
    }

    return data as (BlogComment & { user: User })
}

export const deleteBlogComment = async (id: string): Promise<void> => {
    console.log('Delete comment request:', id);
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete comment error:', error);
        throw new Error('Failed to delete comment: ' + error.message)
    }

    console.log('Delete comment success');
}
