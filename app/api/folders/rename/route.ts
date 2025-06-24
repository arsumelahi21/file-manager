import { getUserSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(req: Request) {
  const session = await getUserSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { folderId, newName } = await req.json();

  if (!folderId || !newName) {
    return new Response("Missing data", { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("folders")
    .update({ name: newName })
    .eq("id", folderId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Rename folder error:", error);
    return new Response("Failed to rename", { status: 500 });
  }

  return new Response("Folder renamed", { status: 200 });
}
