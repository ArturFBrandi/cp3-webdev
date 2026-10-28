import { Navigate, type RouteObject } from 'react-router'
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
          {
            // Everything below loads on demand: visitors never download auth or the dashboard.
            lazy: async () => ({
              Component: (await import('@/components/layout/AuthLayout')).AuthLayout,
            }),
            children: [
              {
                path: 'login',
                lazy: async () => ({ Component: (await import('@/pages/LoginPage')).LoginPage }),
              },
              {
                path: 'dashboard',
                lazy: async () => ({
                  Component: (await import('@/components/layout/ProtectedRoute')).ProtectedRoute,
                }),
                children: [
                  {
                    lazy: async () => ({
                      Component: (await import('@/pages/dashboard/DashboardLayout'))
                        .DashboardLayout,
                    }),
                    children: [
                      { index: true, element: <Navigate to="messages" replace /> },
                      {
                        path: 'messages',
                        lazy: async () => ({
                          Component: (await import('@/pages/dashboard/MessagesPage')).MessagesPage,
                        }),
                      },
                      {
                        path: 'featured',
                        lazy: async () => ({
                          Component: (await import('@/pages/dashboard/FeaturedPage')).FeaturedPage,
                        }),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
]
