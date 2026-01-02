import { useState } from 'react'
import { AlertCircle, Plus, Clock, CheckCircle, XCircle, Filter } from 'lucide-react'

const complaints = [
  {
    id: 1,
    title: 'WiFi Issues in Library',
    description: 'The WiFi connection in the main library has been very slow and unstable for the past week.',
    category: 'Infrastructure',
    status: 'open',
    priority: 'high',
    date: 'Dec 10, 2024',
    responses: 2
  },
  {
    id: 2,
    title: 'Cafeteria Food Quality',
    description: 'The quality of food in the cafeteria has decreased significantly. Requesting improvement.',
    category: 'Services',
    status: 'in-progress',
    priority: 'medium',
    date: 'Dec 8, 2024',
    responses: 5
  },
  {
    id: 3,
    title: 'Parking Space Availability',
    description: 'Not enough parking spaces available during peak hours. Need more parking areas.',
    category: 'Infrastructure',
    status: 'resolved',
    priority: 'medium',
    date: 'Dec 5, 2024',
    responses: 12
  },
  {
    id: 4,
    title: 'Study Room Booking System',
    description: 'The online booking system for study rooms is not working properly.',
    category: 'Technology',
    status: 'open',
    priority: 'high',
    date: 'Dec 12, 2024',
    responses: 1
  },
]

export default function Complaints() {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // In real app, this would submit to API
    alert('Complaint submitted successfully!')
    setShowForm(false)
    setFormData({ title: '', description: '', category: '', priority: 'medium' })
  }

  const filteredComplaints = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter)

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700'
      case 'in-progress': return 'bg-yellow-100 text-yellow-700'
      case 'resolved': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complaints & Issues</h1>
              <p className="text-gray-600">Report issues and track their resolution</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Complaint
          </button>
        </div>
      </div>

      {/* Complaint Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Brief description of the issue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="4"
                placeholder="Provide detailed information about the issue"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Services">Services</option>
                  <option value="Technology">Technology</option>
                  <option value="Safety">Safety</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Submit Complaint</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Filter className="w-4 h-4" />
          All
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'open'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter('in-progress')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'in-progress'
              ? 'bg-yellow-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'resolved'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{complaint.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(complaint.priority)}`} />
                </div>
                <p className="text-gray-600 mb-3">{complaint.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">{complaint.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {complaint.date}
                  </span>
                  <span>{complaint.responses} responses</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t">
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View Details
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                Add Response
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

