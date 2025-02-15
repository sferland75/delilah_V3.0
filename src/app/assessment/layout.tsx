import { SectionNavigation } from '@/components/SectionNavigation';
import { AssessmentProvider } from '@/contexts/AssessmentContext';

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AssessmentProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r bg-background p-4">
          <div className="mb-4 px-2">
            <h2 className="text-lg font-semibold">Assessment Sections</h2>
          </div>
          <SectionNavigation />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </AssessmentProvider>
  );
}