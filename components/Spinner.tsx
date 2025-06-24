export default function Spinner({ size = 4, color = 'white' }) {
    return (
      <div
        className={`w-${size} h-${size} border-2 border-${color} border-t-transparent rounded-full animate-spin`}
      />
    );
  }
  