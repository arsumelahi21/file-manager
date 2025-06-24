import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
 
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-6"> File Manager</h1>
          <nav className="space-y-3">
            <Link href="/dashboard/folders" className="block text-sm hover:underline text-blue-700">
              Folders
            </Link>
            <Link href="/dashboard/files" className="block text-sm hover:underline text-blue-700">
               Files
            </Link>
          </nav>
        </div>
        <div>
          <Link
            href="/auth/signin"
            className="block text-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-8"
          >
            Log Out
          </Link>
        </div>
      </aside>

      
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
