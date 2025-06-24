export default function LoadingUI() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-blue-600">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
            <span className="ml-4">Loading...</span>
        </div>
      
    );
  }
  