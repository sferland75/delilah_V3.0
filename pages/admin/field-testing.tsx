import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Button } from '../../src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../src/components/ui/card';

// Dynamically import the FieldTestPanel to prevent SSR issues
const FieldTestPanel = dynamic(
  () => import('../../src/components/FieldTestPanel'),
  { ssr: false }
);

export default function FieldTestingPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user has admin access in real app
    // For now, just check if field test mode is enabled
    if (typeof window !== 'undefined') {
      const isFieldTestMode = 
        process.env.NEXT_PUBLIC_FIELD_TRIAL === 'true' || 
        localStorage.getItem('field_test_mode') === 'true';
        
      setIsAuthorized(isFieldTestMode);
      setIsLoading(false);
      
      if (!isFieldTestMode) {
        // Enable field test mode for demonstration
        localStorage.setItem('field_test_mode', 'true');
        setIsAuthorized(true);
      }
    }
  }, [router]);
  
  const enableFieldTestMode = () => {
    localStorage.setItem('field_test_mode', 'true');
    setIsAuthorized(true);
    
    // Reload page to initialize field test mode
    window.location.reload();
  };
  
  const disableFieldTestMode = () => {
    localStorage.removeItem('field_test_mode');
    setIsAuthorized(false);
    
    // Redirect to home page
    router.push('/');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we check your authorization.</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Field Testing Access</CardTitle>
            <CardDescription>
              You need to enable field testing mode to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={enableFieldTestMode}
            >
              Enable Field Testing Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Field Testing Administration - Delilah V3.0</title>
      </Head>
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Field Testing Administration</h1>
          
          <Button onClick={() => router.push('/')} variant="outline">
            Return to Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <FieldTestPanel />
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={() => {
                    if (window.fieldTesting) {
                      window.fieldTesting.createBackup();
                    } else {
                      alert('Field testing API not available');
                    }
                  }}
                >
                  Create Manual Backup
                </Button>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    if (window.fieldTesting) {
                      window.fieldTesting.syncOfflineChanges();
                    } else {
                      alert('Field testing API not available');
                    }
                  }}
                >
                  Sync Now
                </Button>
                
                <Button 
                  className="w-full"
                  variant="destructive"
                  onClick={disableFieldTestMode}
                >
                  Disable Field Testing Mode
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Field Testing Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="font-medium">Status</dt>
                    <dd className="text-green-600">Active</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Connection</dt>
                    <dd>{typeof navigator !== 'undefined' && navigator.onLine ? 'Online' : 'Offline'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Storage Usage</dt>
                    <dd>Calculating...</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}