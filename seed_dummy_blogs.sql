-- SQL Script to insert 20 dummy blog posts
-- Make sure you have at least one user in the public.users table before running this.

DO $$
DECLARE
    target_user_id uuid;
    i integer;
BEGIN
    -- Get the first user ID from the public.users table
    SELECT id INTO target_user_id FROM public.users LIMIT 1;

    IF target_user_id IS NULL THEN
        RAISE NOTICE 'No user found in public.users. Please create an account first.';
    ELSE
        -- Insert 20 dummy posts
        FOR i IN 1..20 LOOP
            INSERT INTO public.posts (title, content, image_url, author_id, created_at)
            VALUES (
                'Dummy Story #' || i,
                'This is the content for dummy story number ' || i || '. It features a long description to test the line-clamping and overall layout of the BlogCard component. SimplyBlog is becoming a great platform for sharing stories!',
                'https://picsum.photos/seed/' || i || '/800/600', -- Unique images using picsum
                target_user_id,
                NOW() - (i || ' hours')::interval -- Offset creation time so they appear in order
            );
        END LOOP;
        
        RAISE NOTICE 'Successfully inserted 20 dummy posts linked to user %', target_user_id;
    END IF;
END $$;
