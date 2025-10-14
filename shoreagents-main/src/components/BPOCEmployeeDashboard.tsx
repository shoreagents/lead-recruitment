'use client'

import { useState, useEffect } from 'react'
import { useBPOCEmployees } from '@/hooks/useBPOCEmployees'
import { type BPOCUser } from '@/lib/bpocApiService'

export function BPOCEmployeeDashboard() {
  const { employees, loading, error, getStats } = useBPOCEmployees()
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<BPOCUser | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      const statistics = await getStats()
      setStats(statistics)
    }

    if (employees.length > 0) {
      loadStats()
    }
  }, [employees, getStats])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">BPOC Employee Dashboard</h1>
      
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Employees</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.total as number}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Active</h3>
            <p className="text-2xl font-bold text-green-600">{stats.active as number}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Employed</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.employed as number}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Average Score</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.averageScore as number}</p>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <div 
            key={employee.user_id} 
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedEmployee(employee)}
          >
            <h3 className="text-lg font-semibold">{employee.full_name}</h3>
            <p className="text-gray-600">{employee.position || employee.current_position}</p>
            <p className="text-sm text-gray-500">{employee.location}</p>
            {employee.overall_score && (
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Score: {employee.overall_score}
                </span>
              </div>
            )}
            {employee.work_status && (
              <div className="mt-1">
                <span className={`inline-block text-xs px-2 py-1 rounded ${
                  employee.work_status === 'employed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {employee.work_status}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedEmployee.full_name}</h2>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Position</h3>
                <p>{selectedEmployee.position || selectedEmployee.current_position || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Location</h3>
                <p>{selectedEmployee.location || 'N/A'}</p>
              </div>
              
              {selectedEmployee.bio && (
                <div>
                  <h3 className="font-semibold">Bio</h3>
                  <p>{selectedEmployee.bio}</p>
                </div>
              )}
              
              {selectedEmployee.work_status && (
                <div>
                  <h3 className="font-semibold">Work Status</h3>
                  <p>{selectedEmployee.work_status}</p>
                </div>
              )}
              
              {selectedEmployee.expected_salary && (
                <div>
                  <h3 className="font-semibold">Expected Salary</h3>
                  <p>{selectedEmployee.expected_salary}</p>
                </div>
              )}
              
              {selectedEmployee.skills_snapshot && selectedEmployee.skills_snapshot.length > 0 && (
                <div>
                  <h3 className="font-semibold">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills_snapshot.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedEmployee.overall_score && (
                <div>
                  <h3 className="font-semibold">Analysis Scores</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Overall: {selectedEmployee.overall_score}</div>
                    {selectedEmployee.ats_compatibility_score && (
                      <div>ATS Compatibility: {selectedEmployee.ats_compatibility_score}</div>
                    )}
                    {selectedEmployee.content_quality_score && (
                      <div>Content Quality: {selectedEmployee.content_quality_score}</div>
                    )}
                    {selectedEmployee.professional_presentation_score && (
                      <div>Professional Presentation: {selectedEmployee.professional_presentation_score}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
