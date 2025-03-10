import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  getFieldTestConfig,
  updateFieldTestConfig,
  syncOfflineChanges,
  getBackups,
  restoreFromBackup,
  createBackup
} from '../services/field-test-service';
import { useSelector } from 'react-redux';
import * as LucideIcons from 'lucide-react';

// Use destructuring to get the icons we need
const { 
  WifiIcon, 
  WifiOffIcon, 
  Save, 
  Clock, 
  RotateCcw, 
  Database,
  Settings,
  Info,
  UploadCloud,
  X,
  CheckCircle,
  XCircle
} = LucideIcons;

interface FieldTestPanelProps {
  onClose?: () => void;
}

export function FieldTestPanel({ onClose }: FieldTestPanelProps) {
  const [config, setConfig] = useState(getFieldTestConfig());
  const [backups, setBackups] = useState<any[]>([]);
  const currentId = useSelector((state: any) => state.assessments?.currentId);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  // Load initial config and set up event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load backups if we have a current assessment
    if (currentId) {
      setBackups(getBackups(currentId));
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentId]);
  
  // Update backups when currentId changes
  useEffect(() => {
    if (currentId) {
      setBackups(getBackups(currentId));
    } else {
      setBackups([]);
    }
  }, [currentId]);
  
  const handleConfigChange = (key: keyof typeof config, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateFieldTestConfig({ [key]: value });
  };
  
  const handleIntervalChange = (key: 'autosaveInterval' | 'backupInterval', value: string) => {
    // Convert minutes to milliseconds
    const milliseconds = parseInt(value) * 60 * 1000;
    handleConfigChange(key, milliseconds);
  };
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const handleSyncNow = async () => {
    setSyncStatus('syncing');
    try {
      await syncOfflineChanges();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };
  
  const handleRestoreBackup = (backupKey: string) => {
    // Add confirmation
    if (!confirm('Are you sure you want to restore this backup? Current data will be replaced.')) {
      return;
    }
    
    console.log('Restoring backup:', backupKey);
    
    try {
      // Use window.fieldTesting for consistency if available
      if (window.fieldTesting && window.fieldTesting.restoreBackup) {
        window.fieldTesting.restoreBackup(backupKey);
      } else {
        const data = restoreFromBackup(backupKey);
        if (data) {
          alert('Backup restored successfully!');
        } else {
          alert('Failed to restore backup');
        }
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Error restoring backup: ' + (error as Error).message);
    }
  };
  
  const handleCreateBackup = () => {
    try {
      // Use window.fieldTesting for consistency if available
      if (window.fieldTesting && window.fieldTesting.createBackup) {
        window.fieldTesting.createBackup();
      } else if (currentId) {
        const state = useSelector((state: any) => state);
        const backupKey = createBackup(currentId, state.assessments.currentData);
        if (backupKey) {
          setBackups(getBackups(currentId));
          alert('Backup created successfully!');
        } else {
          alert('Failed to create backup');
        }
      } else {
        alert('No assessment loaded to backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Error creating backup: ' + (error as Error).message);
    }
  };
  
  // Custom Toggle component since we don't have the Switch component
  const Toggle = ({ checked, onChange, id }: { checked: boolean, onChange: (value: boolean) => void, id?: string }) => (
    <div 
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      id={id}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <span 
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} 
      />
    </div>
  );
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Field Testing Settings
          </CardTitle>
          {onClose && (
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          Configure data persistence and autosave features for field testing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="sync">Sync & Backup</TabsTrigger>
            <TabsTrigger value="restore">Restore</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="autosave-toggle" className="font-medium">Autosave</Label>
                <span className="text-sm text-muted-foreground">Automatically save changes</span>
              </div>
              <Toggle 
                id="autosave-toggle"
                checked={config.autosaveEnabled}
                onChange={(checked) => handleConfigChange('autosaveEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="autosave-interval" className="font-medium">Autosave Interval</Label>
                <span className="text-sm text-muted-foreground">How often to save changes</span>
              </div>
              <Select 
                value={(config.autosaveInterval / 60 / 1000).toString()}
                onValueChange={(value) => handleIntervalChange('autosaveInterval', value)}
                disabled={!config.autosaveEnabled}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">30 seconds</SelectItem>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="2">2 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="debug-toggle" className="font-medium">Debug Mode</Label>
                <span className="text-sm text-muted-foreground">Show detailed logging information</span>
              </div>
              <Toggle 
                id="debug-toggle"
                checked={config.debugMode}
                onChange={(checked) => handleConfigChange('debugMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label className="font-medium">Connection Status</Label>
                <span className="text-sm text-muted-foreground">Current network connection</span>
              </div>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <WifiIcon className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOffIcon className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-500 font-medium">Offline</span>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sync" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="sync-toggle" className="font-medium">Sync on Connect</Label>
                <span className="text-sm text-muted-foreground">Automatically sync when online</span>
              </div>
              <Toggle 
                id="sync-toggle"
                checked={config.syncOnConnect}
                onChange={(checked) => handleConfigChange('syncOnConnect', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="backup-toggle" className="font-medium">Automatic Backups</Label>
                <span className="text-sm text-muted-foreground">Create local backups of assessment data</span>
              </div>
              <Toggle 
                id="backup-toggle"
                checked={config.backupEnabled}
                onChange={(checked) => handleConfigChange('backupEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="backup-interval" className="font-medium">Backup Interval</Label>
                <span className="text-sm text-muted-foreground">How often to create backups</span>
              </div>
              <Select 
                value={(config.backupInterval / 60 / 1000).toString()}
                onValueChange={(value) => handleIntervalChange('backupInterval', value)}
                disabled={!config.backupEnabled}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 mt-2"
              onClick={handleCreateBackup}
            >
              <Save className="h-4 w-4" />
              Create Backup Now
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 mt-2"
              onClick={handleSyncNow}
              disabled={syncStatus === 'syncing' || !isOnline}
            >
              {syncStatus === 'idle' && <UploadCloud className="h-4 w-4" />}
              {syncStatus === 'syncing' && <Clock className="h-4 w-4 animate-spin" />}
              {syncStatus === 'success' && <Save className="h-4 w-4 text-green-500" />}
              {syncStatus === 'error' && <Info className="h-4 w-4 text-red-500" />}
              
              {syncStatus === 'idle' && 'Sync Now'}
              {syncStatus === 'syncing' && 'Syncing...'}
              {syncStatus === 'success' && 'Sync Successful'}
              {syncStatus === 'error' && 'Sync Failed'}
            </Button>
          </TabsContent>
          
          <TabsContent value="restore" className="space-y-4">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Available Backups
            </h3>
            
            {backups.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-center text-muted-foreground">
                No backups available for this assessment
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                {backups.map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">Backup #{index + 1}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(backup.timestamp)}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleRestoreBackup(backup.key)}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mt-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Restore Information</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Restoring from a backup will replace the current assessment data with the backup data. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          {isOnline ? 'Connected to network' : 'Working offline'}
        </div>
        <div className="text-xs text-muted-foreground">
          Last backup: {backups.length > 0 ? formatDate(backups[0].timestamp) : 'Never'}
        </div>
      </CardFooter>
    </Card>
  );
}

// Add global ambient type definition for fieldTesting
declare global {
  interface Window {
    fieldTesting?: {
      togglePanel: () => void;
      getBackups: (assessmentId?: string) => any[];
      createBackup: () => boolean;
      restoreBackup: (backupKey: string) => boolean;
      syncOfflineChanges: () => Promise<boolean>;
    };
  }
}

export default FieldTestPanel;