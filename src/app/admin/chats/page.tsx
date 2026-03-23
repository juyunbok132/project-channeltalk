'use client'

import { useState } from 'react'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null)

  if (!password) {
    return <AdminLogin onLogin={setPassword} />
  }

  return <AdminDashboard password={password} />
}
