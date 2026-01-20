import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import HomeLayout from "@/components/layout/HomeLayout";

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <HomeLayout/>
    </div>
  );
}
