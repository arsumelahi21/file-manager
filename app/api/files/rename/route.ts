import { getUserSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(req: Request) {
  const session = await getUserSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fileId, newName } = await req.json();

  if (!fileId || !newName) {
    return new Response("Missing parameters", { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("files")
    .update({ name: newName })
    .eq("id", fileId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Rename error:", error);
    return new Response("Rename failed", { status: 500 });
  }

  return new Response("Renamed successfully", { status: 200 });
}
