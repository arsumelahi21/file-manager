'use client'

import Spinner from '@/components/Spinner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push('/auth/signin');
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-6">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 drop-shadow">
          Welcome to Your File Manager 
        </h1>
        <p className="text-gray-700 text-lg">
          A secure and easy way to store, manage, and access your files from anywhere.
        </p>

        <button
          onClick={handleClick}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading && <Spinner />}
          {loading ? 'Redirecting...' : 'Get Started'}
        </button>
      </div>
    </main>
  );
}
