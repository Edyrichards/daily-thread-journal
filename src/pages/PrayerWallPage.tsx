import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PrayerRequestCard from '@/components/PrayerRequestCard';
import { 
  PrayerRequest as PrayerRequestType, 
  getPrayerRequests, 
  incrementPrayedCount,
  addPrayerRequest // Added
} from '@/lib/storage';
import { Button } from '@/components/ui/button'; // Added
import { PlusCircle } from 'lucide-react'; // Added
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog'; // Added
import { Label } from '@/components/ui/label'; // Added
import { Textarea } from '@/components/ui/textarea'; // Added
import { Checkbox } from '@/components/ui/checkbox'; // Added
import { useToast } from '@/hooks/use-toast'; // Added

const PrayerWallPage: React.FC = () => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequestType[]>([]);
  const [newRequestText, setNewRequestText] = useState(""); // Added
  const [isAnonymousPost, setIsAnonymousPost] = useState(true); // Added
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Added
  const { toast } = useToast(); // Added

  useEffect(() => {
    const requests = getPrayerRequests();
    setPrayerRequests(requests);
  }, []);

  const handlePrayClicked = (requestId: string) => {
    const updatedRequest = incrementPrayedCount(requestId);
    if (updatedRequest) {
      setPrayerRequests(prevRequests =>
        prevRequests.map(r => (r.id === requestId ? updatedRequest : r))
      );
    }
  };

  const handleViewCommentsClicked = (requestId: string) => {
    // Placeholder for future implementation
    console.log("View comments for request ID:", requestId);
  };

  const handleSubmitPrayerRequest = () => {
    if (!newRequestText.trim()) {
      toast({
        title: "Empty Prayer",
        description: "Please write something for your prayer request.",
        variant: "destructive",
      });
      return;
    }

    const newPrayer = addPrayerRequest(newRequestText, isAnonymousPost);
    setPrayerRequests(prev => [newPrayer, ...prev]); // Optimistic update

    toast({
      title: "Prayer Shared",
      description: "Your prayer request has been posted.",
    });

    setNewRequestText("");
    setIsAnonymousPost(true);
    setIsFormModalOpen(false);
  };

  return (
    <Layout title="Prayer Wall">
      <div className="p-4 md:p-8">
        <h2 className="text-3xl font-serif text-foreground mb-8 text-center">
          Community Prayer Wall
        </h2>
        
        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
          <DialogTrigger asChild>
            <div className="text-center mb-8">
              <Button className="rounded-2xl">
                <PlusCircle size={20} className="mr-2" /> Add Your Prayer Request
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif">Share Your Prayer Request</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="prayerText" className="text-foreground">Your Prayer</Label>
                <Textarea 
                  id="prayerText" 
                  value={newRequestText} 
                  onChange={(e) => setNewRequestText(e.target.value)} 
                  placeholder="Write your prayer request here..." 
                  className="rounded-xl min-h-[100px] mt-1 bg-background" 
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="anonymous" 
                  checked={isAnonymousPost} 
                  onCheckedChange={(checked) => setIsAnonymousPost(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-foreground">Post Anonymously</Label>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="ghost" className="rounded-xl">Cancel</Button>
              </DialogClose>
              <Button 
                type="submit" 
                onClick={handleSubmitPrayerRequest} 
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit Prayer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="space-y-6 max-w-2xl mx-auto">
          {prayerRequests.length > 0 ? (
            prayerRequests.map(request => (
              <PrayerRequestCard
                key={request.id}
                request={request}
                onPrayClicked={handlePrayClicked}
                onViewCommentsClicked={handleViewCommentsClicked} 
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No prayer requests yet. Be the first to share one!
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PrayerWallPage;
