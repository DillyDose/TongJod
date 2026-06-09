import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TongJod — ต้องจด',
  description: 'จดทุกบาท ใช้ชีวิตสบายใจ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
