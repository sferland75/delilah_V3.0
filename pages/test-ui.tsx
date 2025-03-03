import React from 'react';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
  Separator,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Progress,
  Badge,
  Alert, 
  AlertDescription, 
  AlertTitle
} from "@/components/ui";

export default function TestUI() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">UI Component Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card Component</CardTitle>
            <CardDescription>This is a card component from the UI library</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the content of the card.</p>
          </CardContent>
          <CardFooter>
            <Button>Action Button</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tabs Component</CardTitle>
            <CardDescription>This shows tabs from the UI library</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <p className="p-4">Content for Tab 1</p>
              </TabsContent>
              <TabsContent value="tab2">
                <p className="p-4">Content for Tab 2</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Progress & Badge</CardTitle>
            <CardDescription>Progress bar and badge components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2">Progress at 30%:</p>
              <Progress value={30} className="h-2" />
            </div>
            <div>
              <p className="mb-2">Progress at 70%:</p>
              <Progress value={70} className="h-2" />
            </div>
            <div className="flex gap-2">
              <Badge>Default Badge</Badge>
              <Badge className="bg-green-500">Green Badge</Badge>
              <Badge className="bg-amber-500">Amber Badge</Badge>
              <Badge className="bg-red-500">Red Badge</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Separator</CardTitle>
            <CardDescription>Alert components and separator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational alert.
              </AlertDescription>
            </Alert>
            
            <Separator />
            
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                This is an error alert.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
