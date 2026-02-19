'use client';

import { trpc } from '../../utils/trpc';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user } = useUser();
  const { data: tenant, isLoading } = trpc.tenants.myTenant.useQuery();

  if (isLoading) return <div>Loading tenant info...</div>;

  return (
    <div>
      <h1>Welcome back, {user?.firstName}</h1>
      {tenant ? (
        <p>You are managing: <strong>{tenant.name}</strong></p>
      ) : (
        <p>You don't have a tenant organization yet. Please contact support or create one.</p>
      )}
    </div>
  );
}
