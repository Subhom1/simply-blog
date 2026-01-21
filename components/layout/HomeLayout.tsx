'use client'
import Header from "../header/Header";
import BlogCard from "../blog/BlogCard";
import Button from "../ui/button";
import { useAppSelector } from "@/utils/hooks";
import { useRouter } from "next/navigation";

const buttonStyle = " cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/40 active:scale-95"
export default function HomeLayout() {
  const blog = useAppSelector((state) => state.blog)
  const router = useRouter()
  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-10">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-2">Latest Stories</h2>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Explore the Blog</h1>
          </div>
          <Button className={buttonStyle} onClick={() => router.push('/create-blog')}>
            Create Blog
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blog.blogs.length === 0 ? (
            <div className="col-span-full">
              <div className="mb-12 p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl text-center">
                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  No blogs yet, create your first one!
                </p>
              </div>
            </div>
          ) : (
            blog.blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                description={blog.content}
                author={blog.user?.full_name || 'Anonymous'}
                createdAt={new Date(blog.created_at).toLocaleDateString()}
                imageUrl={blog.image_url || 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800'}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}