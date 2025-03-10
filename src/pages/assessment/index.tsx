import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function AssessmentDashboard() {
  const router = useRouter();
  const [assessments, setAssessments] = useState([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastSaved, setLastSaved] = useState(null);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  
  // Monitor online/offline status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);
  
  // If there's extracted data in the URL, it would be loaded here
  useEffect(() => {
    // Check for imported data in the URL (would be implemented based on your data passing method)
    if (router.query.importedData) {
      // In a real implementation, you would parse and use the imported data
      console.log('Imported data received:', router.query.importedData);
    }
    
    // Simulated assessments data
    const dummyAssessments = [
      { 
        id: 1, 
        patientName: 'John Doe', 
        date: '2025-02-15', 
        type: 'In-Home Assessment', 
        status: 'In Progress' 
      },
      { 
        id: 2, 
        patientName: 'Jane Smith', 
        date: '2025-02-10', 
        type: 'Follow-up Assessment', 
        status: 'Completed' 
      },
      { 
        id: 3, 
        patientName: 'Robert Johnson', 
        date: '2025-02-05', 
        type: 'Initial Assessment', 
        status: 'Completed' 
      }
    ];
    
    setAssessments(dummyAssessments);
    // Simulate initial save
    setLastSaved(new Date());
  }, [router.query]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assessments</h1>
        
        <div className="flex space-x-2">
          <Button onClick={() => router.push('/assessment/new')}>
            New Assessment
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/import/assessment')}
          >
            Import from PDF
          </Button>
        </div>
      </div>
      
      {/* Field Test Status Banner */}
      <div style={{
        padding: '10px 15px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isOnline ? '#d4edda' : '#fff3cd',
        color: isOnline ? '#155724' : '#856404',
        border: '1px solid',
        borderColor: isOnline ? '#c3e6cb' : '#ffeeba'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: isOnline ? '#28a745' : '#ffc107',
            marginRight: '10px'
          }}></div>
          <span><strong>Field Testing:</strong> {isOnline ? 'Online - Data synced to server' : 'Offline - Changes saved locally'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {lastSaved && (
            <span style={{ fontSize: '14px' }}>Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
            <input 
              type="checkbox" 
              checked={autosaveEnabled} 
              onChange={() => setAutosaveEnabled(!autosaveEnabled)}
            />
            Autosave
          </label>
          <button
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '5px 10px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            onClick={() => setLastSaved(new Date())}
          >
            Save Now
          </button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Assessments</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Assessments</CardTitle>
              <CardDescription>
                View and manage all assessment records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Patient Name</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((assessment) => (
                      <tr key={assessment.id} className="border-b">
                        <td className="py-3 px-4">{assessment.patientName}</td>
                        <td className="py-3 px-4">{assessment.date}</td>
                        <td className="py-3 px-4">{assessment.type}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            assessment.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {assessment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/assessment/${assessment.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inProgress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Assessments</CardTitle>
              <CardDescription>
                Assessments that are currently being worked on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Patient Name</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments
                      .filter((a) => a.status === 'In Progress')
                      .map((assessment) => (
                        <tr key={assessment.id} className="border-b">
                          <td className="py-3 px-4">{assessment.patientName}</td>
                          <td className="py-3 px-4">{assessment.date}</td>
                          <td className="py-3 px-4">{assessment.type}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/assessment/${assessment.id}`)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Assessments</CardTitle>
              <CardDescription>
                Finalized assessment records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Patient Name</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments
                      .filter((a) => a.status === 'Completed')
                      .map((assessment) => (
                        <tr key={assessment.id} className="border-b">
                          <td className="py-3 px-4">{assessment.patientName}</td>
                          <td className="py-3 px-4">{assessment.date}</td>
                          <td className="py-3 px-4">{assessment.type}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/assessment/${assessment.id}`)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
