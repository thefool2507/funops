import type { Metadata } from 'next'
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'FunOps — Task Management Redefined',
    template: '%s | FunOps',
  },
  description: 'A professional, elegant task management tool designed for focused minds. Manage your daily operations with clarity and style.',
  keywords: ['task management', 'productivity', 'kanban', 'todo', 'funops'],
  openGraph: {
    title: 'FunOps — Task Management Redefined',
    description: 'Manage your daily operations with clarity and style.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <script dangerouslySetInnerHTML={{ __html: `
    const t = localStorage.getItem('theme') || 'light';
    if (t === 'dark') document.documentElement.classList.add('dark');
    if (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.classList.add('dark');
  `}} />
      <body className={`${bricolage.variable} ${dmSans.variable} ${jetbrains.variable} gradient-mesh noise`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e1b17',
              color: '#f0ece4',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontSize: '13px',
              fontFamily: 'var(--font-dm-sans)',
            },
            success: {
              iconTheme: { primary: '#4ade80', secondary: '#1e1b17' },
            },
            error: {
              iconTheme: { primary: '#fb7185', secondary: '#1e1b17' },
            },
          }}
        />
      </body>
    </html>
  )
}
