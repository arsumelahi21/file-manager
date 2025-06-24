import { supabase } from "@/lib/supabase";
import { getUserSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const { name, parentId } = await req.json();

  const { error } = await supabase.from("folders").insert({
    name,
    parent_id: parentId || null,
    user_id: session.user.id,
  });

  if (error) {
    console.error(error);
    return new Response("Folder creation failed", { status: 500 });
  }

  return new Response("Folder created", { status: 201 });
}
