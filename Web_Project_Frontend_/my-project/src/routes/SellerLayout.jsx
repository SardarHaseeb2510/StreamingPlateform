import React from 'react'
import SellerHeader from '../components/seller/SellerHeader'
import SellerFooter from '../components/seller/SellerFooter'

function SellerLayout({Children}) {
  return (
    <div className="flex flex-col min-h-screen">
    < SellerHeader/>
    <main className="flex-grow">
      {Children}
    </main>
    <SellerFooter />
  </div>
  )
}

export default SellerLayout
