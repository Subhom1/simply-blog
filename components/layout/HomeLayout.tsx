'use client'
import Header from "../header/Header";
import BlogCard from "../blog/BlogCard";
import Button from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { fetchBlogs } from "@/utils/api-services/blog";
import { setBlogs, setLoading, setError, setCurrentPage } from "@/utils/redux/blogSlice";

const buttonStyle = " cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/40 active:scale-95"
export default function HomeLayout() {
  const { blogs, pagination, loading } = useAppSelector((state) => state.blog)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const loadBlogs = async () => {
      dispatch(setLoading(true))
      try {
        const data = await fetchBlogs(pagination.currentPage, pagination.pageSize)
        dispatch(setBlogs(data))
      } catch (error: any) {
        dispatch(setError(error.message))
      }
    }
    loadBlogs()
  }, [dispatch, pagination.currentPage, pagination.pageSize])

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
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
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="col-span-full">
              <div className="mb-12 p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl text-center">
                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  No blogs yet, create your first one!
                </p>
              </div>
            </div>
          ) : (
            blogs.map((blog) => (
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

        {/* Pagination Controls */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <Button
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${pagination.currentPage === page
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <Button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium"
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}