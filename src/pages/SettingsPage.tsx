
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState("daily");
  const { toast } = useToast();
  
  const handleExportData = () => {
    // In a real app, this would export the user's data
    const journalEntries = localStorage.getItem('journal_entries') || '[]';
    const prayers = localStorage.getItem('prayers') || '[]';
    const habitLogs = localStorage.getItem('habit_logs') || '[]';
    
    const exportData = {
      journalEntries: JSON.parse(journalEntries),
      prayers: JSON.parse(prayers),
      habitLogs: JSON.parse(habitLogs),
      exportDate: new Date().toISOString()
    };
    
    // Create a downloadable file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `threads-of-grace-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data exported",
      description: "Your data has been exported successfully.",
    });
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would actually change the theme
    toast({
      title: "Theme changed",
      description: `Changed to ${!darkMode ? "dark" : "light"} mode.`,
    });
  };
  
  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast({
      title: "Notifications updated",
      description: `Notifications ${!notifications ? "enabled" : "disabled"}.`,
    });
  };
  
  return (
    <Layout title="Settings">
      <div className="space-y-6 pb-16 animate-fade-in">
        <Card className="border-[#e8e8e0] shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-serif text-[#333] mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="font-serif">Dark Mode</Label>
                <p className="text-xs text-[#666]">Use a darker theme for low light environments</p>
              </div>
              <Switch 
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#e8e8e0] shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-serif text-[#333] mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="font-serif">Enable Notifications</Label>
                  <p className="text-xs text-[#666]">Receive gentle reminders and encouragements</p>
                </div>
                <Switch 
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={toggleNotifications}
                />
              </div>
              
              {notifications && (
                <div className="pt-2">
                  <Label className="font-serif mb-2 block">Reminder Frequency</Label>
                  <div className="flex space-x-2">
                    {["daily", "weekly", "monthly"].map((frequency) => (
                      <Button
                        key={frequency}
                        variant={reminderFrequency === frequency ? "default" : "outline"}
                        onClick={() => setReminderFrequency(frequency)}
                        className={reminderFrequency === frequency 
                          ? "bg-[#c3d1b8] text-[#333] hover:bg-[#a3b198]" 
                          : "border-[#d8d8c8] text-[#666]"}
                      >
                        <span className="capitalize">{frequency}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#e8e8e0] shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-serif text-[#333] mb-4">Data Management</h2>
            <p className="text-[#666] text-sm mb-4">
              Export all your journal entries, prayers, and habit tracking data as a JSON file.
            </p>
            <Button
              onClick={handleExportData}
              className="w-full bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333]"
            >
              Export Your Data
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-[#e8e8e0] shadow-sm bg-[#f4f6f0]">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-serif text-[#333] mb-2">About Threads of Grace</h2>
            <p className="text-[#666] text-sm">
              Version 1.0.0
            </p>
            <p className="text-[#666] text-xs mt-4">
              A soul-centered journaling and prayer app designed to gently guide users 
              through emotional healing, spiritual growth, and deeper connection with God.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;
