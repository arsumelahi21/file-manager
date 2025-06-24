import { getUserSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const session = await getUserSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", session.user.id);

  if (error) {
    console.error(error);
    return new Response("Error fetching files", { status: 500 });
  }

  return Response.json(data);
}
