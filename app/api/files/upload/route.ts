import { getUserSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folderId = formData.get("folderId") as string | null;

  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

  const sanitize = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9\-_\.]/g, "-");

  if (!file) return new Response("No file uploaded", { status: 400 });

 
  let folderName = "root";
  if (folderId) {
    const { data: folder, error } = await supabaseAdmin
      .from("folders")
      .select("name")
      .eq("id", folderId)
      .single();

    if (error || !folder) return new Response("Invalid folder", { status: 400 });
    folderName = folder.name;
  }
  
  const cleanFileName = sanitize(file.name);
  const cleanFolderName = sanitize(folderName || "root");
  
  const filePath = `${session.user.id}/${cleanFolderName}/${Date.now()}-${cleanFileName}`;

  if (file.size > 5 * 1024 * 1024) {
    return alert("Max file size is 5MB");
  }
  if (!allowedTypes.includes(file.type)) {
    return alert("Only images and PDFs are allowed");
  }


  const { error: uploadError } = await supabaseAdmin.storage
    .from("files")
    .upload(filePath, file);

  const mimeType = file.type;
  const { error: dbError } = await supabaseAdmin.from("files").insert({
    name: file.name,
    path: filePath,
    user_id: session.user.id,
    folder_id: folderId || null,
    type: mimeType,
  });

  if (dbError) {
    console.error(dbError);
    return new Response("DB insert failed", { status: 500 });
  }

  return new Response("File uploaded", { status: 200 });
}
