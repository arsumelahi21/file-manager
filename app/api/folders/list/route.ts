import { supabase } from "@/lib/supabase";
import { getUserSession } from "@/lib/auth";

export async function GET() {
  const session = await getUserSession();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) return new Response("Error", { status: 500 });

  return Response.json(data);
}
