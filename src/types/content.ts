export interface Link {
  label: string
  href: string
}

export interface Profile {
  role: string
  lede: string
  location: string
  availability: string
}

export interface SkillGroup {
  title: string
  items: string
}

export interface Achievement {
  title: string
  description: string
}

export interface ExperienceItem {
  title: string
  /** ISO month, e.g. "2023-02" */
  start: string
  /** ISO month, or null when ongoing */
  end: string | null
  bullets: string[]
  achievements: Achievement[]
  note?: { text: string; links: Link[] }
}

export interface InDevelopmentProject {
  name: string
  status: string
  tags: string[]
  description: string
  linkNote: string
}

export interface Content {
  profile: Profile
  skills: SkillGroup[]
  experience: ExperienceItem[]
  inDevelopment: InDevelopmentProject[]
}
