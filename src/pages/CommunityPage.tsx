
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Users, Share2, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CommunityFeed from "@/components/CommunityFeed";
import InsightSharing from "@/components/InsightSharing";
import CommunityChallenges from "@/components/CommunityChallenges";
import { addPrayerRequest } from "@/lib/storage";

const CommunityPage = () => {
  const [newRequest, setNewRequest] = useState("");
  const [verseReference, setVerseReference] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'most-prayed'>('all');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.trim()) {
      toast({
        title: "Prayer request required",
        description: "Please write your prayer request.",
        variant: "destructive",
      });
      return;
    }
    
    addPrayerRequest(newRequest, true);
    setNewRequest("");
    setVerseReference("");
    
    toast({
      title: "Prayer request shared",
      description: "Your prayer request has been shared with the community.",
    });
  };
  
  return (
    <Layout title="Community">
      <div className="space-y-6 pb-16 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-foreground">Community</h1>
          <p className="text-muted-foreground">
            Connect, share, and grow together in faith
          </p>
        </div>

        <Tabs defaultValue="prayer-wall" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prayer-wall" className="flex items-center space-x-1">
              <Heart size={16} />
              <span className="hidden sm:inline">Prayer Wall</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-1">
              <Share2 size={16} />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center space-x-1">
              <Trophy size={16} />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center space-x-1">
              <Users size={16} />
              <span className="hidden sm:inline">Groups</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prayer-wall" className="space-y-6">
            <Card className="border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-serif text-[#333] mb-4">Share Your Prayer Request</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      value={newRequest}
                      onChange={(e) => setNewRequest(e.target.value)}
                      placeholder="What would you like prayer for?"
                      className="border-[#e8e8e0] focus:border-[#a3b198]"
                    />
                  </div>
                  <div>
                    <Input
                      value={verseReference}
                      onChange={(e) => setVerseReference(e.target.value)}
                      placeholder="Optional scripture reference (e.g., John 3:16)"
                      className="border-[#e8e8e0] focus:border-[#a3b198]"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] rounded-full"
                  >
                    Share Anonymously
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="flex space-x-2 mb-4">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All Requests
              </Button>
              <Button
                variant={activeFilter === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('recent')}
              >
                Recent
              </Button>
              <Button
                variant={activeFilter === 'most-prayed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('most-prayed')}
              >
                Most Prayed
              </Button>
            </div>

            <CommunityFeed filter={activeFilter} />
          </TabsContent>

          <TabsContent value="insights">
            <InsightSharing />
          </TabsContent>

          <TabsContent value="challenges">
            <CommunityChallenges />
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardContent className="p-8 text-center">
                <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Small Groups</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with others in your area for deeper fellowship and Bible study.
                </p>
                <Button variant="outline">
                  Find Groups Near You
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CommunityPage;
