'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Eye, MessageSquare, Check, Trash2, Loader2 } from 'lucide-react'

interface Inquiry {
  id: string
  name: string
  phone: string | null
  email: string | null
  productTitle: string | null
  message: string
  status: string
  createdAt: string
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchInquiries = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/admin/inquiries?${params}`)
      const data = await res.json()
      if (data.success) {
        setInquiries(data.data.inquiries || [])
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter])

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        if (selectedInquiry?.id === id) setSelectedInquiry(null)
        fetchInquiries()
      } else {
        alert('Error deleting')
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error)
      alert('Error deleting')
    } finally {
      setDeleting(null)
    }
  }

  const handleMarkAsReplied = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REPLIED' }),
      })
      const data = await res.json()
      if (data.success) {
        fetchInquiries()
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: 'REPLIED' })
        }
      }
    } catch (error) {
      console.error('Error updating inquiry:', error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch {
      return dateString
    }
  }

  const pendingCount = inquiries.filter((i) => i.status === 'PENDING').length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Inquiries</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {pendingCount} inquiries awaiting response
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Awaiting Response</option>
            <option value="REPLIED">Replied</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm divide-y overflow-hidden">
          {inquiries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No inquiries found
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedInquiry?.id === inquiry.id ? 'bg-orange-50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-dark">{inquiry.name}</h3>
                    <p className="text-sm text-gray-500">{inquiry.productTitle || '-'}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      inquiry.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {inquiry.status === 'PENDING' ? 'Pending' : 'Replied'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{inquiry.message}</p>
                <p className="text-xs text-gray-400">{formatDate(inquiry.createdAt)}</p>
              </div>
            ))
          )}
        </div>

        {/* Inquiry Detail */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {selectedInquiry ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-dark">Inquiry Details</h2>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    selectedInquiry.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {selectedInquiry.status === 'PENDING' ? 'Pending' : 'Replied'}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-gray-400">Name</label>
                  <p className="font-medium text-dark">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Phone</label>
                  <p className="font-medium text-dark" dir="ltr">{selectedInquiry.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Email</label>
                  <p className="font-medium text-dark" dir="ltr">{selectedInquiry.email || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Product</label>
                  <p className="font-medium text-dark">{selectedInquiry.productTitle || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Message</label>
                  <p className="text-gray-600">{selectedInquiry.message}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Date</label>
                  <p className="text-gray-600">{formatDate(selectedInquiry.createdAt)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </button>
                {selectedInquiry.status === 'PENDING' && (
                  <button
                    onClick={() => handleMarkAsReplied(selectedInquiry.id)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  disabled={deleting === selectedInquiry.id}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deleting === selectedInquiry.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
