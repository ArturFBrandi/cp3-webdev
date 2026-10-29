import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { InDevelopment } from '@/components/sections/InDevelopment'
import { Skills } from '@/components/sections/Skills'

export function HomePage() {
  return (
    <>
      <Hero />
      <InDevelopment />
      <Skills />
      <Experience />
    </>
  )
}
