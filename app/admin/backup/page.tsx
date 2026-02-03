'use client'

import { useState } from 'react'
import { Database, Download, Upload, Clock, Check, AlertCircle } from 'lucide-react'

const mockBackups = [
  {
    id: '1',
    filename: 'backup_2024-01-15_14-30.sql',
    size: '12.5 MB',
    createdAt: '2024/01/15 - 14:30',
    type: 'auto',
    status: 'success',
  },
  {
    id: '2',
    filename: 'backup_2024-01-14_14-30.sql',
    size: '12.3 MB',
    createdAt: '2024/01/14 - 14:30',
    type: 'auto',
    status: 'success',
  },
  {
    id: '3',
    filename: 'backup_2024-01-13_10-00.sql',
    size: '12.1 MB',
    createdAt: '2024/01/13 - 10:00',
    type: 'manual',
    status: 'success',
  },
]

export default function BackupPage() {
  const [isBackingUp, setIsBackingUp] = useState(false)

  const handleBackup = () => {
    setIsBackingUp(true)
    // Simulate backup
    setTimeout(() => setIsBackingUp(false), 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Backup</h1>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-dark mb-2">Create Backup</h2>
              <p className="text-sm text-gray-500 mb-4">
                Create a backup of all website data
              </p>
              <button
                onClick={handleBackup}
                disabled={isBackingUp}
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isBackingUp ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Backing up...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Start Backup
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-dark mb-2">Restore Backup</h2>
              <p className="text-sm text-gray-500 mb-4">
                Restore data from a backup file
              </p>
              <label className="inline-flex items-center gap-2 bg-gray-100 text-dark px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Select File
                <input type="file" className="hidden" accept=".sql,.zip" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Auto Backup Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="font-bold text-dark mb-4">Auto Backup Settings</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto Backup
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Versions to Keep
            </label>
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="7">7 versions</option>
              <option value="14">14 versions</option>
              <option value="30">30 versions</option>
            </select>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-700 font-medium">Next Backup</p>
            <p className="text-blue-600">Tomorrow at 14:30</p>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-bold text-dark">Backup History</h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                File Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Size
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockBackups.map((backup) => (
              <tr key={backup.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm text-dark">
                  {backup.filename}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {backup.size}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {backup.createdAt}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      backup.type === 'auto'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {backup.type === 'auto' ? 'Auto' : 'Manual'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {backup.status === 'success' ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      Success
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Error
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:underline text-sm">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
