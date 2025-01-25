import React from 'react'
import UserHeader from '../components/user/UserHeader'
import UserFooter from '../components/user/UserFooter'

function UserLayout({Children}) {
  return (
    <div className="flex flex-col min-h-screen">
    <UserHeader />
    <main className="flex-grow">
      {Children}
    </main>
    <UserFooter />
  </div>
  )
}

export default UserLayout
