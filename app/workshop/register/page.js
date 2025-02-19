import { WorkshopRegisterForm } from '@/app/components/Workshop/WorkshopRegistration'
import React from 'react'

function Registerpage() {
  return (
    <div className="min-h-screen flex flex-col justify-center">
    <div className="max-w-4xl mx-auto p-4">
      <WorkshopRegisterForm/>
    </div>
  </div>
  )
}

export default Registerpage;