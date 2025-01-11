import DashboardLayout from '../../components/layout/DashboardLayout'

export default function ManagerDashboard() {
  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-primary-100 rounded-md p-3">
                  {/* Icon */}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Patients
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* More stats cards... */}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
            {/* Activity content */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 