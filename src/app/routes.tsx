import type { RouteObject } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { ErrorPage } from '@/pages/ErrorPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { ProjectsPage } from '@/pages/ProjectsPage'

export const routes: RouteObject[] = [
  {
    Component: AppLayout,
    // Last-resort boundary if the layout itself fails.
    ErrorBoundary: ErrorPage,
    children: [
      {
        // Keeps header and footer visible when a page throws.
        ErrorBoundary: ErrorPage,
        children: [
          { index: true, Component: HomePage },
          { path: 'projects', Component: ProjectsPage },
          { path: 'projects/:name', Component: ProjectDetailPage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
]
