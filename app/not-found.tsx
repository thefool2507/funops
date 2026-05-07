import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-display font-800 text-[120px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-amber-400/40 to-transparent select-none">
          404
        </div>
        <h1 className="font-display text-2xl font-700 text-[--text-primary] mt-4 mb-2">
          Page not found
        </h1>
        <p className="text-[--text-secondary] text-sm mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
          <Link href="/" className="btn-ghost border border-white/10">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
