
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileText, Database, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getJournalEntries, getPrayers, getPrayerRequests } from '@/lib/storage';
import { getEnhancedJournalEntries, getEnhancedPrayers, getSpiritualMilestones } from '@/lib/enhancedStorage';
import { format } from 'date-fns';

interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  dataTypes: {
    journal: boolean;
    prayers: boolean;
    prayerRequests: boolean;
    milestones: boolean;
  };
  dateRange: 'all' | 'lastMonth' | 'lastYear';
}

const DataExport: React.FC = () => {
  const { toast } = useToast();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    dataTypes: {
      journal: true,
      prayers: true,
      prayerRequests: true,
      milestones: true,
    },
    dateRange: 'all'
  });
  const [isExporting, setIsExporting] = useState(false);

  const getFilteredData = () => {
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    
    let cutoffDate = 0;
    if (exportOptions.dateRange === 'lastMonth') {
      cutoffDate = now - oneMonth;
    } else if (exportOptions.dateRange === 'lastYear') {
      cutoffDate = now - oneYear;
    }

    const data: any = {};

    if (exportOptions.dataTypes.journal) {
      const entries = getEnhancedJournalEntries()
        .filter(entry => entry.createdAt >= cutoffDate);
      data.journalEntries = entries;
    }

    if (exportOptions.dataTypes.prayers) {
      const prayers = getEnhancedPrayers()
        .filter(prayer => prayer.dateCreated >= cutoffDate);
      data.prayers = prayers;
    }

    if (exportOptions.dataTypes.prayerRequests) {
      const requests = getPrayerRequests()
        .filter(request => request.createdAt >= cutoffDate);
      data.prayerRequests = requests;
    }

    if (exportOptions.dataTypes.milestones) {
      const milestones = getSpiritualMilestones()
        .filter(milestone => milestone.date >= cutoffDate);
      data.spiritualMilestones = milestones;
    }

    return data;
  };

  const exportAsJSON = (data: any) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `threads_of_grace_export_${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = (data: any) => {
    let csvContent = '';

    // Export journal entries
    if (data.journalEntries) {
      csvContent += 'Journal Entries\n';
      csvContent += 'Date,Mood,Content,Category,Tags,Word Count\n';
      data.journalEntries.forEach((entry: any) => {
        const row = [
          format(new Date(entry.createdAt), 'yyyy-MM-dd HH:mm'),
          entry.mood,
          `"${entry.content.replace(/"/g, '""')}"`,
          entry.category || '',
          entry.tags?.join(';') || '',
          entry.wordCount || 0
        ].join(',');
        csvContent += row + '\n';
      });
      csvContent += '\n';
    }

    // Export prayers
    if (data.prayers) {
      csvContent += 'Prayers\n';
      csvContent += 'Date,Type,Category,Content,Status,Answer Date\n';
      data.prayers.forEach((prayer: any) => {
        const row = [
          format(new Date(prayer.dateCreated), 'yyyy-MM-dd HH:mm'),
          prayer.type,
          prayer.category,
          `"${prayer.content.replace(/"/g, '""')}"`,
          prayer.status,
          prayer.dateAnswered ? format(new Date(prayer.dateAnswered), 'yyyy-MM-dd') : ''
        ].join(',');
        csvContent += row + '\n';
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `threads_of_grace_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = getFilteredData();
      
      if (Object.keys(data).length === 0) {
        toast({
          title: "No Data",
          description: "No data found for the selected criteria.",
          variant: "destructive",
        });
        return;
      }

      switch (exportOptions.format) {
        case 'json':
          exportAsJSON(data);
          break;
        case 'csv':
          exportAsCSV(data);
          break;
        case 'pdf':
          toast({
            title: "Coming Soon",
            description: "PDF export will be available in the next update.",
          });
          return;
      }

      toast({
        title: "Export Successful",
        description: `Your data has been exported as ${exportOptions.format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="font-serif flex items-center">
          <Download className="mr-2" size={20} />
          Export Your Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Export Format</Label>
          <Select 
            value={exportOptions.format} 
            onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, format: value }))}
          >
            <SelectTrigger className="rounded-xl mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON (Complete Data)</SelectItem>
              <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
              <SelectItem value="pdf">PDF (Coming Soon)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Date Range</Label>
          <Select 
            value={exportOptions.dateRange} 
            onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, dateRange: value }))}
          >
            <SelectTrigger className="rounded-xl mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Data to Include</Label>
          <div className="space-y-3">
            {Object.entries(exportOptions.dataTypes).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({
                      ...prev,
                      dataTypes: { ...prev.dataTypes, [key]: checked as boolean }
                    }))
                  }
                />
                <Label htmlFor={key} className="text-sm capitalize">
                  {key === 'prayerRequests' ? 'Prayer Requests' : key}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleExport}
          disabled={isExporting || !Object.values(exportOptions.dataTypes).some(Boolean)}
          className="w-full rounded-xl"
        >
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataExport;
