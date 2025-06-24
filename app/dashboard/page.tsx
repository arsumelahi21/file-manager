import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
    
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-700">File Manager</h1>

        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/dashboard/folders" className="text-gray-700 hover:underline">
            Folders
          </Link>
          <Link href="/dashboard/files" className="text-gray-700 hover:underline">
            Files
          </Link>
        </nav>

        <div className="mt-auto">
          <Link
            href="/auth/signin"
            className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Log Out
          </Link>
        </div>
      </aside>

     
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
