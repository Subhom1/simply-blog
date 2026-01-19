export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="flex flex-col items-center justify-center h-screen" >
            Blog Post: {id}
        </div>
    );
}
