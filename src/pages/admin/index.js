import React from 'react';
import Layout from '@/components/Layout';
import AdminNav from '@/components/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Activity, Users, FileText, Settings } from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <AdminNav />
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage application settings and monitor system performance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pattern Recognition Card */}
              <Link href="/admin/pattern-recognition-dashboard">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Pattern Recognition</CardTitle>
                      <CardDescription>
                        Monitor extraction performance and training
                      </CardDescription>
                    </div>
                    <Activity className="h-6 w-6 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      View detailed metrics on document extraction, pattern matching performance,
                      and training effectiveness. Track improvements over time.
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {/* User Management Card */}
              <Link href="/admin/user-management">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        Manage users and permissions
                      </CardDescription>
                    </div>
                    <Users className="h-6 w-6 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      Create and manage user accounts, assign roles and permissions,
                      and monitor user activity within the system.
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {/* Audit Logs Card */}
              <Link href="/admin/audit-logs">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Audit Logs</CardTitle>
                      <CardDescription>
                        Review system activity logs
                      </CardDescription>
                    </div>
                    <FileText className="h-6 w-6 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      Access detailed logs of all system activity, including user actions,
                      document processing, and system events.
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {/* System Settings Card */}
              <Link href="/admin/system-settings">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>System Settings</CardTitle>
                      <CardDescription>
                        Configure application settings
                      </CardDescription>
                    </div>
                    <Settings className="h-6 w-6 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      Configure system-wide settings, including pattern recognition
                      parameters, default values, and integration settings.
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
