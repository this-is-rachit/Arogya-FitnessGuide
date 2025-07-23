import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar/Navbar';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Arogya Admin',
  description: 'Your Guide To Become A Fit-योगी',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
