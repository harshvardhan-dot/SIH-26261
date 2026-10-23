import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import OfficialTopNav from '@/components/OfficialTopNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Suspense fallback={<aside className="sidebar" style={{ width: 280 }} />}>
        <Sidebar />
      </Suspense>
      <main className="main-content">
        <OfficialTopNav />
        {children}
      </main>
    </div>
  );
}

