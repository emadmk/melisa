import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Building2, Calendar } from 'lucide-react'
import { Breadcrumb, Pagination } from '@/components/common'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Project {
  id: string
  slug: string
  title: string
  description: string | null
  image: string | null
  category: string | null
  client: string | null
  location: string | null
  completedAt: Date | null
}

export const metadata: Metadata = {
  title: 'Completed Projects',
  description: 'Sample projects implemented by Melisa in security and telecommunications systems',
}

async function getProjects(page: number = 1, limit: number = 9) {
  const skip = (page - 1) * limit

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { completedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.project.count({
      where: { status: 'PUBLISHED' }
    })
  ])

  return { projects: projects as Project[], total, totalPages: Math.ceil(total / limit) }
}

async function getStats() {
  const [projectCount, clientCount] = await Promise.all([
    prisma.project.count({ where: { status: 'PUBLISHED' } }),
    prisma.project.groupBy({
      by: ['client'],
      where: { status: 'PUBLISHED' },
    })
  ])

  return {
    projects: projectCount,
    clients: clientCount.length,
  }
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit' }).format(date)
}

export default async function ProjectsPage() {
  const [{ projects, totalPages }, stats] = await Promise.all([
    getProjects(),
    getStats()
  ])

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-dark text-center">Completed Projects</h1>
          <p className="text-gray-500 text-center mt-3">A sample of our successful projects</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-3xl font-bold mb-1">+{stats.projects}</div>
              <div className="text-sm opacity-80">Successful Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">+{stats.clients}</div>
              <div className="text-sm opacity-80">Satisfied Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">+15</div>
              <div className="text-sm opacity-80">Years of Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">+7</div>
              <div className="text-sm opacity-80">Emirates</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects registered yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={project.image || '/images/projects/default.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.category && (
                      <span className="absolute top-4 right-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-lg font-bold text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description || ''}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                      {project.client && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {project.client}
                        </span>
                      )}
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </span>
                      )}
                      {project.completedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(project.completedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination currentPage={1} totalPages={totalPages} baseUrl="/projects" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
