import { useParams } from 'react-router'
import { Section } from '@/components/ui/Section'

export function ProjectDetailPage() {
  const { name = '' } = useParams()
  return <Section title={name}>{null}</Section>
}
