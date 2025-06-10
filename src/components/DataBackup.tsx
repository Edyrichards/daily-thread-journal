
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Upload, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DataBackup: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createBackup = async () => {
    setIsProcessing(true);
    try {
      const backupData = {
        timestamp: Date.now(),
        version: '1.0',
        data: {
          journal_entries: localStorage.getItem('journal_entries'),
          enhanced_journal_entries: localStorage.getItem('enhanced_journal_entries'),
          prayers: localStorage.getItem('prayers'),
          enhanced_prayers: localStorage.getItem('enhanced_prayers'),
          prayer_requests: localStorage.getItem('prayer_requests'),
          spiritual_milestones: localStorage.getItem('spiritual_milestones'),
          reminderPreference: localStorage.getItem('reminderPreference'),
          bibleVersionPreference: localStorage.getItem('bibleVersionPreference'),
        }
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `threads_of_grace_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Created",
        description: "Your complete backup has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "Backup Failed",
        description: "An error occurred while creating the backup.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const restoreBackup = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.data || !backupData.version) {
        throw new Error('Invalid backup file format');
      }

      // Restore each data type
      Object.entries(backupData.data).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });

      toast({
        title: "Restore Complete",
        description: "Your data has been restored successfully. Please refresh the page.",
      });

      // Suggest page refresh
      setTimeout(() => {
        if (confirm('Data restored! Would you like to refresh the page to see your restored data?')) {
          window.location.reload();
        }
      }, 2000);

    } catch (error) {
      console.error('Restore error:', error);
      toast({
        title: "Restore Failed",
        description: "The backup file appears to be corrupted or invalid.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        restoreBackup(file);
      } else {
        toast({
          title: "Invalid File",
          description: "Please select a valid JSON backup file.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="font-serif flex items-center">
          <Shield className="mr-2" size={20} />
          Backup & Restore
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Restoring a backup will overwrite your current data. Make sure to create a backup first!
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Create Backup</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Download a complete backup of all your data including journals, prayers, and settings.
            </p>
            <Button 
              onClick={createBackup}
              disabled={isProcessing}
              className="w-full rounded-xl"
              variant="outline"
            >
              <Download className="mr-2" size={16} />
              {isProcessing ? 'Creating Backup...' : 'Create Backup'}
            </Button>
          </div>

          <div>
            <Label className="text-sm font-medium">Restore from Backup</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Upload a previous backup file to restore your data.
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isProcessing}
              className="rounded-xl cursor-pointer"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full rounded-xl mt-2"
              variant="outline"
            >
              <Upload className="mr-2" size={16} />
              {isProcessing ? 'Restoring...' : 'Select Backup File'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataBackup;
