"use client"
import Image from 'next/image'
import styles from './page.module.css'
import HomeBanner1 from '@/components/HomeBanner1/HomeBanner1'
import HomeBanner2 from '@/components/HomeBanner2/HomeBanner2'
import HomeBanner3 from '@/components/HomeBanner3/HomeBanner3'

export default function Home() {
  return (
    <main className={styles.main}>
      <HomeBanner1 />
      <HomeBanner3 />
      <HomeBanner2 />
    </main>
  )
}
