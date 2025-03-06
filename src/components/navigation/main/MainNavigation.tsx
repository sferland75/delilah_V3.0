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
  Upload,
  PenTool,
  Settings,
  Users,
  Search,
  Heart,
  Clock
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

export default function MainNavigation() {
  const router = useRouter();
  const path = router.asPath;
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-6">
          {/* Main Navigation Section */}
          <div className="space-y-1">
            <NavItem 
              href="/" 
              label="Dashboard" 
              icon={<Home size={18} />} 
              isActive={path === '/'}
            />
            
            <NavItem 
              href="/assessment" 
              label="Assessment List" 
              icon={<ClipboardList size={18} />} 
              isActive={path === '/assessment'}
            />
            
            <NavItem 
              href="/full-assessment" 
              label="Full Assessment" 
              icon={<FileText size={18} />} 
              isActive={path.startsWith('/full-assessment')}
            />
            
            <NavItem 
              href="/import-pdf" 
              label="Import PDF" 
              icon={<Upload size={18} />} 
              isActive={path === '/import-pdf' || path === '/enhanced-import'}
            />
            
            <NavItem 
              href="/report-drafting" 
              label="Report Drafting" 
              icon={<PenTool size={18} />} 
              isActive={path.startsWith('/report-drafting')}
            />
          </div>
          
          {/* Quick Access Section */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 pb-2">
              Quick Access
            </div>
            
            <NavItem 
              href="/medical-full" 
              label="Medical History" 
              icon={<Heart size={18} />} 
              isActive={path === '/medical-full'}
            />
            
            <NavItem 
              href="/emergency-symptoms" 
              label="Symptoms" 
              icon={<Activity size={18} />} 
              isActive={path === '/emergency-symptoms'}
            />
            
            <NavItem 
              href="/typical-day" 
              label="Typical Day" 
              icon={<Clock size={18} />} 
              isActive={path === '/typical-day'}
            />
          </div>
          
          {/* System Navigation */}
          <div className="space-y-1 pt-4 border-t border-gray-200">
            <NavItem 
              href="/settings" 
              label="Settings" 
              icon={<Settings size={18} />} 
              isActive={path === '/settings'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
