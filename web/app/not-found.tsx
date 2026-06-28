import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🌉</div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-on-surface mb-4">Page Not Found</h2>
        <p className="text-on-surface-variant mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="inline-block bg-primary text-on-primary px-6 py-2.5 rounded-lg hover:opacity-90 transition">
          Go Home
        </Link>
      </div>
    </div>
  );
}
