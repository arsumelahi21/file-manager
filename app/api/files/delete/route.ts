import { getUserSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(req: Request) {
  const session = await getUserSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fileId, filePath } = await req.json();

  if (!fileId || !filePath) {
    return new Response("Missing file info", { status: 400 });
  }


  const { error: storageError } = await supabaseAdmin.storage
    .from("files")
    .remove([filePath]);

  if (storageError) {
    console.error("Storage delete error:", storageError);
    return new Response("Failed to delete from storage", { status: 500 });
  }

  
  const { error: dbError } = await supabaseAdmin
    .from("files")
    .delete()
    .eq("id", fileId)
    .eq("user_id", session.user.id); // ✅ Ensure only user’s own file

  if (dbError) {
    console.error("DB delete error:", dbError);
    return new Response("Failed to delete metadata", { status: 500 });
  }

  return new Response("File deleted", { status: 200 });
}
