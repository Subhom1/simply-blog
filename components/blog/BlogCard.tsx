import Link from 'next/link'

interface BlogCardProps {
    id: string
    title: string
    description: string
    author: string
    createdAt: string
    imageUrl: string
}

export default function BlogCard({ id, title, description, author, createdAt, imageUrl }: BlogCardProps) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>{createdAt}</span>
                    <span className="mx-2">•</span>
                    <span>{author}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    <Link href={`/blog/${id}`}>
                        {title}
                    </Link>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {description}
                </p>
                <Link
                    href={`/blog/${id}`}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center"
                >
                    Read more
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}
