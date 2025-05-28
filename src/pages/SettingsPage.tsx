import React, { useState, useEffect } from 'react'; // Added useEffect
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { useTheme } from "next-themes"; // Added
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { getJournalEntries } from '@/lib/storage';
import { Switch } from "@/components/ui/switch"; // Added

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme, resolvedTheme } = useTheme(); // Added
  const [isMounted, setIsMounted] = useState(false); // Added

  const [reminderPreference, setReminderPreference] = useState<string>(
    () => localStorage.getItem('reminderPreference') || 'none'
  );
  const [bibleVersion, setBibleVersion] = useState<string>(
    () => localStorage.getItem('bibleVersionPreference') || 'default'
  );

  // Effect for theme mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleReminderChange = (value: string) => {
    setReminderPreference(value);
    localStorage.setItem('reminderPreference', value);
    toast({
      title: "Settings Updated",
      description: "Reminder preference saved.",
    });
  };

  const handleBibleVersionChange = (value: string) => {
    setBibleVersion(value);
    localStorage.setItem('bibleVersionPreference', value);
    toast({
      title: "Settings Updated",
      description: "Bible version preference saved.",
    });
  };

  const handleExportData = async () => {
    const entries = getJournalEntries();

    if (entries.length === 0) {
      toast({
        title: "No Data",
        description: "You don't have any journal entries to export yet.",
        variant: "default", // Or "info" if you add such a variant
      });
      return;
    }

    try {
      const jsonString = JSON.stringify(entries, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `threads_of_grace_journal_${new Date().toISOString().split('T')[0]}.json`;
      
      // Append to body, click, and remove for cross-browser compatibility
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url); // Clean up the object URL

      toast({
        title: "Export Successful",
        description: "Your journal entries have been downloaded.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting your data.",
        variant: "destructive",
      });
    }
  };

  const reminderOptions = [
    { value: "none", label: "None" },
    { value: "morning", label: "Morning (e.g., 8:00 AM)" },
    { value: "afternoon", label: "Afternoon (e.g., 1:00 PM)" },
    { value: "evening", label: "Evening (e.g., 7:00 PM)" },
  ];

  const bibleVersionOptions = [
    { value: "default", label: "Default (App Choice)" },
    { value: "KJV", label: "King James Version (KJV)" },
    { value: "NIV", label: "New International Version (NIV)" },
    { value: "ESV", label: "English Standard Version (ESV)" },
  ];

  return (
    <Layout title="Settings">
      <motion.div
        className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 [will-change:transform,opacity]"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-serif">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reminderSelect" className="text-foreground">Daily Journaling Reminder</Label>
              <Select value={reminderPreference} onValueChange={handleReminderChange} >
                <SelectTrigger id="reminderSelect" className="rounded-xl mt-1">
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
                <SelectContent>
                  {reminderOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-serif">Bible Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bibleVersionSelect" className="text-foreground">Preferred Bible Version</Label>
              <Select value={bibleVersion} onValueChange={handleBibleVersionChange}>
                <SelectTrigger id="bibleVersionSelect" className="rounded-xl mt-1">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {bibleVersionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Export Data Section */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-serif">Export Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download all your journal entries as a JSON file. This is useful for creating your own backups.
            </p>
            <Button 
              onClick={handleExportData} 
              className="w-full md:w-auto rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Download Journal Entries
            </Button>
          </CardContent>
        </Card>
        
        {/* Ambiance / Music Toggle Section */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-serif">Ambiance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-1">
              <Label htmlFor="music-toggle-switch" className="flex flex-col space-y-1">
                <span>Soft Background Music</span>
                <span className="font-normal leading-snug text-muted-foreground text-xs">
                  Enable calming background music during your session.
                </span>
              </Label>
              <Switch
                id="music-toggle-switch"
                disabled // Disabled for now
                // checked={isMusicEnabled} // Future state
                // onCheckedChange={setIsMusicEnabled} // Future handler
              />
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              (This feature is coming soon!)
            </p>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-serif">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-1">
              <Label htmlFor="dark-mode-switch" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground text-xs">
                  Toggle between light and dark themes.
                </span>
              </Label>
              <Switch
                id="dark-mode-switch"
                checked={resolvedTheme === 'dark'}
                onCheckedChange={(isChecked) => setTheme(isChecked ? 'dark' : 'light')}
                disabled={!isMounted}
              />
            </div>
            {isMounted && resolvedTheme && (
                <p className="text-xs text-muted-foreground pt-1">
                    Current active theme: {resolvedTheme} (System default is: {theme === 'system' ? 'Yes' : 'No'})
                </p>
            )}
          </CardContent>
        </Card>

      </motion.div>
    </Layout>
  );
};

export default SettingsPage;
