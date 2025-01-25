import React from 'react'
import AdminHeader from '../components/admin/AdminHeader'
import AdminFooter from '../components/admin/AdminFooter'

function AdminLayout({Children}) {
  return (
    <div className="flex flex-col min-h-screen">
    <AdminHeader />
    <main className="flex-grow">
      {Children}
    </main>
    <AdminFooter />
  </div>
  )
}

export default AdminLayout
