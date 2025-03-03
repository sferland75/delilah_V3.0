import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home,
  FileText,
  Activity,
  ClipboardList,
  Calendar,
  MapPin,
  Heart,
  UserPlus,
  Clock,
  Calculator,
  PenTool,
  Upload
} from 'lucide-react';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, icon, isActive }) => {
  return (
    <Link href={href} passHref>
      <Button 
        variant={isActive ? "default" : "ghost"} 
        className={`w-full justify-start ${isActive ? 'bg-blue-600 text-white' : ''}`}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
};

export default function AssessmentNav() {
  const router = useRouter();
  const path = router.asPath;
  
  // Check if the path is for the full assessment or a specific section
  const isFullAssessment = path.startsWith('/full-assessment');
  const isSectionActive = (section: string) => {
    if (isFullAssessment && router.query.section === section) return true;
    return false;
  };

  // Direct access check
  const isDirectAccess = {
    symptoms: path === '/emergency-symptoms',
    medical: path === '/medical-full',
    typicalDay: path === '/typical-day',
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-1">
          <NavItem 
            href="/" 
            label="Home" 
            icon={<Home size={18} />} 
            isActive={path === '/'}
          />
          
          <NavItem 
            href="/assessment" 
            label="Assessment Dashboard" 
            icon={<ClipboardList size={18} />} 
            isActive={path === '/assessment'}
          />
          
          <NavItem 
            href="/full-assessment" 
            label="Full Assessment" 
            icon={<FileText size={18} />} 
            isActive={isFullAssessment && !router.query.section}
          />

          <NavItem 
            href="/assessment-sections" 
            label="Section Menu" 
            icon={<Calendar size={18} />} 
            isActive={path === '/assessment-sections'}
          />
          
          <NavItem 
            href="/import-pdf" 
            label="Import PDF" 
            icon={<Upload size={18} />} 
            isActive={path === '/import-pdf'}
          />
          
          <NavItem 
            href="/report-drafting" 
            label="Report Drafting" 
            icon={<PenTool size={18} />} 
            isActive={path.startsWith('/report-drafting')}
          />
          
          <div className="pt-2 pb-1">
            <div className="text-sm font-medium text-gray-500 mb-2 pl-2">Quick Access Sections</div>
          </div>
          
          <NavItem 
            href="/full-assessment?section=initial" 
            label="Initial Assessment" 
            icon={<ClipboardList size={18} />} 
            isActive={isSectionActive('initial')}
          />
          
          <NavItem 
            href="/emergency-symptoms" 
            label="Symptoms Assessment" 
            icon={<Activity size={18} />} 
            isActive={isDirectAccess.symptoms || isSectionActive('symptoms')}
          />
          
          <NavItem 
            href="/medical-full" 
            label="Medical History" 
            icon={<Heart size={18} />} 
            isActive={isDirectAccess.medical || isSectionActive('medical')}
          />
          
          <NavItem 
            href="/typical-day" 
            label="Typical Day" 
            icon={<Clock size={18} />} 
            isActive={isDirectAccess.typicalDay || isSectionActive('typical-day')}
          />
          
          <NavItem 
            href="/full-assessment?section=attendant-care" 
            label="Attendant Care" 
            icon={<UserPlus size={18} />} 
            isActive={isSectionActive('attendant-care')}
          />
          
          <NavItem 
            href="/full-assessment?section=environment" 
            label="Environment" 
            icon={<MapPin size={18} />} 
            isActive={isSectionActive('environment')}
          />

          <NavItem 
            href="/full-assessment?section=housekeeping" 
            label="Housekeeping" 
            icon={<Calculator size={18} />} 
            isActive={isSectionActive('housekeeping')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
