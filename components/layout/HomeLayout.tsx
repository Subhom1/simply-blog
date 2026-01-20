'use client'
import Header from "../header/Header";
import BlogCard from "../blog/BlogCard";

const mockBlogs = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    description: 'Learn the core concepts of Next.js 15 and how it revolutionizes the way we build modern web applications with the App Router and React Server Components.',
    author: 'Alex Rivera',
    createdAt: 'Jan 20, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Mastering Tailwind CSS Logic',
    description: 'Deep dive into utility-first CSS and how to build beautiful, responsive interfaces without ever leaving your HTML files.',
    author: 'Sarah Chen',
    createdAt: 'Jan 18, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800'
  }
]

export default function HomeLayout() {
    return (
        <div>
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col mb-10">
          <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2">Latest Stories</h2>
          <h1 className="text-4xl font-extrabold text-gray-900">Explore the Blog</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>
      </main>
        </div>
    )
}