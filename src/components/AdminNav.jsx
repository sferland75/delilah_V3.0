import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRight } from 'lucide-react';

const AdminNav = () => {
  const router = useRouter();
  
  const isActive = (path) => {
    return router.pathname === path ? 'bg-primary text-primary-foreground' : 'hover:bg-muted';
  };

  return (
    <div className="bg-card border rounded-md p-4 space-y-1">
      <h3 className="font-medium mb-3">Admin Dashboard</h3>
      
      <Link 
        href="/admin/pattern-recognition-dashboard"
        className={`flex items-center px-3 py-2 rounded-md text-sm ${isActive('/admin/pattern-recognition-dashboard')}`}
      >
        <ChevronRight className="mr-2 h-4 w-4" />
        Pattern Recognition
      </Link>
      
      <Link 
        href="/admin/user-management"
        className={`flex items-center px-3 py-2 rounded-md text-sm ${isActive('/admin/user-management')}`}
      >
        <ChevronRight className="mr-2 h-4 w-4" />
        User Management
      </Link>
      
      <Link 
        href="/admin/audit-logs"
        className={`flex items-center px-3 py-2 rounded-md text-sm ${isActive('/admin/audit-logs')}`}
      >
        <ChevronRight className="mr-2 h-4 w-4" />
        Audit Logs
      </Link>
      
      <Link 
        href="/admin/system-settings"
        className={`flex items-center px-3 py-2 rounded-md text-sm ${isActive('/admin/system-settings')}`}
      >
        <ChevronRight className="mr-2 h-4 w-4" />
        System Settings
      </Link>
    </div>
  );
};

export default AdminNav;
