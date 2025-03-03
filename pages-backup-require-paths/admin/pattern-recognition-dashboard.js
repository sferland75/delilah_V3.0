import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, FileText, Brain, TrendingUp } from 'lucide-react';

const PatternRecognitionDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate loading dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // In a real implementation, this would fetch data from an API
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample dashboard data
      const mockData = {
        overview: {
          totalDocuments: 128,
          documentsThisMonth: 24,
          avgConfidence: 0.88,
          documentTypes: [
            { type: 'OT_ASSESSMENT', count: 78, avgConfidence: 0.91 },
            { type: 'MEDICAL_REPORT', count: 32, avgConfidence: 0.84 },
            { type: 'PSYCHOLOGY_REPORT', count: 18, avgConfidence: 0.82 }
          ]
        },
        sections: {
          DEMOGRAPHICS: { extracted: 128, avgConfidence: 0.95 },
          MEDICAL_HISTORY: { extracted: 124, avgConfidence: 0.87 },
          SYMPTOMS: { extracted: 118, avgConfidence: 0.82 },
          FUNCTIONAL_STATUS: { extracted: 114, avgConfidence: 0.85 },
          RECOMMENDATIONS: { extracted: 126, avgConfidence: 0.92 },
          ATTENDANT_CARE: { extracted: 102, avgConfidence: 0.89 }
        },
        fields: {
          // Top fields by extraction frequency
          topFields: [
            { field: 'DEMOGRAPHICS.name', extracted: 128, avgConfidence: 0.97 },
            { field: 'DEMOGRAPHICS.dateOfLoss', extracted: 126, avgConfidence: 0.93 },
            { field: 'RECOMMENDATIONS.therapyRecommendations', extracted: 124, avgConfidence: 0.90 },
            { field: 'ATTENDANT_CARE.hoursPerWeek', extracted: 98, avgConfidence: 0.92 },
            { field: 'MEDICAL_HISTORY.injuries', extracted: 122, avgConfidence: 0.85 }
          ],
          // Fields with lowest confidence
          lowConfidenceFields: [
            { field: 'SYMPTOMS.frequency', extracted: 68, avgConfidence: 0.62 },
            { field: 'FUNCTIONAL_STATUS.adlLimitations', extracted: 92, avgConfidence: 0.68 },
            { field: 'MEDICAL_HISTORY.medications', extracted: 88, avgConfidence: 0.71 },
            { field: 'SYMPTOMS.severity', extracted: 76, avgConfidence: 0.74 },
            { field: 'FUNCTIONAL_STATUS.mobilityStatus', extracted: 98, avgConfidence: 0.76 }
          ]
        },
        training: {
          totalTrainingSessions: 42,
          trainingsThisMonth: 8,
          trainingEffectiveness: 0.82, // 82% improvement after training
          recentTrainingSessions: [
            { id: 'training-1646582', date: '2025-02-28', documentType: 'OT_ASSESSMENT', fieldsImproved: 7 },
            { id: 'training-1646498', date: '2025-02-26', documentType: 'MEDICAL_REPORT', fieldsImproved: 4 },
            { id: 'training-1646412', date: '2025-02-24', documentType: 'OT_ASSESSMENT', fieldsImproved: 9 },
            { id: 'training-1646318', date: '2025-02-21', documentType: 'PSYCHOLOGY_REPORT', fieldsImproved: 5 },
            { id: 'training-1646122', date: '2025-02-18', documentType: 'OT_ASSESSMENT', fieldsImproved: 6 }
          ],
          improvementBySection: [
            { section: 'DEMOGRAPHICS', initialConfidence: 0.82, currentConfidence: 0.95, improvement: 0.13 },
            { section: 'MEDICAL_HISTORY', initialConfidence: 0.71, currentConfidence: 0.87, improvement: 0.16 },
            { section: 'SYMPTOMS', initialConfidence: 0.68, currentConfidence: 0.82, improvement: 0.14 },
            { section: 'FUNCTIONAL_STATUS', initialConfidence: 0.70, currentConfidence: 0.85, improvement: 0.15 },
            { section: 'RECOMMENDATIONS', initialConfidence: 0.81, currentConfidence: 0.92, improvement: 0.11 },
            { section: 'ATTENDANT_CARE', initialConfidence: 0.76, currentConfidence: 0.89, improvement: 0.13 }
          ]
        }
      };
      
      setDashboardData(mockData);
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, []);
  
  // Format confidence as percentage
  const formatConfidence = (confidence) => {
    return `${Math.round(confidence * 100)}%`;
  };
  
  // Get color based on confidence level
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    setIsLoading(true);
    // In a real implementation, this would fetch fresh data
    setTimeout(() => setIsLoading(false), 1000);
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-medium">Loading dashboard data...</h2>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Pattern Recognition Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and analyze pattern recognition performance and training
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Document Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Documents Processed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-4xl font-bold">{dashboardData.overview.totalDocuments}</div>
                  <div className="text-sm text-muted-foreground">
                    {dashboardData.overview.documentsThisMonth} this month
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2">Avg. Confidence:</div>
                    <Badge>{formatConfidence(dashboardData.overview.avgConfidence)}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Document Types */}
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Document Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.overview.documentTypes.map((docType) => (
                      <div key={docType.type} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{docType.type}</div>
                          <Badge variant="outline">
                            {docType.count} documents
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={docType.avgConfidence * 100} 
                            className="h-2"
                          />
                          <span className="text-sm">
                            {formatConfidence(docType.avgConfidence)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Sections Tab */}
          <TabsContent value="sections" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Section Extraction</CardTitle>
                  <CardDescription>
                    Performance metrics for each section
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.sections).map(([section, data]) => (
                      <div key={section} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{section}</div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {data.extracted}/{dashboardData.overview.totalDocuments} documents
                            </Badge>
                            <Badge className={getConfidenceColor(data.avgConfidence)}>
                              {formatConfidence(data.avgConfidence)}
                            </Badge>
                          </div>
                        </div>
                        <Progress 
                          value={data.avgConfidence * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Fields Tab */}
          <TabsContent value="fields" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Fields */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Fields</CardTitle>
                  <CardDescription>
                    Fields with highest extraction confidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.fields.topFields.map((field) => (
                      <div key={field.field} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{field.field}</div>
                          <Badge className={getConfidenceColor(field.avgConfidence)}>
                            {formatConfidence(field.avgConfidence)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={field.avgConfidence * 100} 
                            className="h-2"
                          />
                          <span className="text-sm">
                            {field.extracted}/{dashboardData.overview.totalDocuments}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Low Confidence Fields */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Low Confidence Fields</CardTitle>
                  <CardDescription>
                    Fields that need improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.fields.lowConfidenceFields.map((field) => (
                      <div key={field.field} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{field.field}</div>
                          <Badge className={getConfidenceColor(field.avgConfidence)}>
                            {formatConfidence(field.avgConfidence)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={field.avgConfidence * 100} 
                            className="h-2"
                          />
                          <span className="text-sm">
                            {field.extracted}/{dashboardData.overview.totalDocuments}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Training Tab */}
          <TabsContent value="training" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Training Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Training Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-4xl font-bold">{dashboardData.training.totalTrainingSessions}</div>
                  <div className="text-sm text-muted-foreground">
                    {dashboardData.training.trainingsThisMonth} this month
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2">Effectiveness:</div>
                    <Badge>{formatConfidence(dashboardData.training.trainingEffectiveness)}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Training */}
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Training Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.training.recentTrainingSessions.map((session) => (
                      <div key={session.id} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{session.documentType}</div>
                          <div className="text-sm text-muted-foreground">{session.date}</div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            ID: {session.id}
                          </Badge>
                          <Badge variant="secondary">
                            {session.fieldsImproved} fields improved
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Improvement by Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Section Improvement</CardTitle>
                <CardDescription>
                  Confidence improvement after training
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.training.improvementBySection.map((section) => (
                    <div key={section.section} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{section.section}</div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            Initial: {formatConfidence(section.initialConfidence)}
                          </Badge>
                          <Badge variant="outline">
                            Current: {formatConfidence(section.currentConfidence)}
                          </Badge>
                          <Badge variant="success">
                            +{formatConfidence(section.improvement)}
                          </Badge>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Initial
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Current
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex bg-gray-200 rounded-full">
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-muted-foreground"
                            style={{ width: `${section.initialConfidence * 100}%` }}
                          ></div>
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                            style={{ width: `${section.improvement * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PatternRecognitionDashboard;
