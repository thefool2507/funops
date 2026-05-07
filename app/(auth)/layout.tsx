export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-amber-400/3 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-sage-400/3 rounded-full blur-3xl pointer-events-none" />
      {children}
    </div>
  )
}
