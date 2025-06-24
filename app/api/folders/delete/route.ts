import { getUserSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(req: Request) {
  const session = await getUserSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { folderId } = await req.json();
  if (!folderId) {
    return new Response("Missing folder ID", { status: 400 });
  }


  const { data: filesInFolder, error: checkError } = await supabaseAdmin
    .from("files")
    .select("id")
    .eq("folder_id", folderId)
    .eq("user_id", session.user.id);

  if (checkError) {
    console.error(checkError);
    return new Response("Error checking folder contents", { status: 500 });
  }

  if (filesInFolder.length > 0) {
    return new Response("Folder is not empty", { status: 400 });
  }

 
  const { error: deleteError } = await supabaseAdmin
    .from("folders")
    .delete()
    .eq("id", folderId)
    .eq("user_id", session.user.id);

  if (deleteError) {
    console.error(deleteError);
    return new Response("Failed to delete folder", { status: 500 });
  }

  return new Response("Folder deleted", { status: 200 });
}
