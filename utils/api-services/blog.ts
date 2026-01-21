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

export const fetchBlogs = async (): Promise<BlogPost[]> => {
    console.log('Fetching blogs...');
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
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Fetch Blogs Error:', error);
        throw new Error('Failed to fetch blogs: ' + error.message)
    }

    console.log('Fetch Blogs Success:', data.length, 'blogs found');
    return data as BlogPost[]
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
