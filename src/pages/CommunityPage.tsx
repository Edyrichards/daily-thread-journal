
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommunityPost {
  id: string;
  content: string;
  reference?: string;
  prayerCount: number;
  createdAt: number;
}

const CommunityPage = () => {
  const [newRequest, setNewRequest] = useState("");
  const [verseReference, setVerseReference] = useState("");
  const { toast } = useToast();
  
  // Sample data - in a real app, this would be stored in a database
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: "1",
      content: "I'm struggling with loneliness and need God's comfort.",
      reference: "Psalm 34:18",
      prayerCount: 36,
      createdAt: Date.now() - 86400000
    },
    {
      id: "2",
      content: "Please pray for wisdom as I make an important decision.",
      reference: "James 1:5",
      prayerCount: 26,
      createdAt: Date.now() - 172800000
    },
    {
      id: "3",
      content: "Praying for healing for my mother who is ill.",
      prayerCount: 42,
      createdAt: Date.now() - 345600000
    }
  ]);

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
    
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      content: newRequest,
      reference: verseReference || undefined,
      prayerCount: 0,
      createdAt: Date.now()
    };
    
    setCommunityPosts([newPost, ...communityPosts]);
    setNewRequest("");
    setVerseReference("");
    
    toast({
      title: "Prayer request shared",
      description: "Your prayer request has been shared with the community.",
    });
  };
  
  const handlePray = (id: string) => {
    setCommunityPosts(
      communityPosts.map(post => 
        post.id === id 
          ? { ...post, prayerCount: post.prayerCount + 1 } 
          : post
      )
    );
    
    toast({
      title: "Prayer counted",
      description: "Thank you for joining in prayer.",
    });
  };
  
  return (
    <Layout title="Community">
      <div className="space-y-6 pb-16 animate-fade-in">
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
        
        <h2 className="text-xl font-serif text-[#333] mb-4">Community Prayer Requests</h2>
        
        <div className="space-y-4">
          {communityPosts.map((post) => (
            <Card 
              key={post.id}
              className="border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-4">
                <p className="text-[#333] mb-2 font-serif">{post.content}</p>
                {post.reference && (
                  <p className="text-[#666] text-sm mb-3 italic">{post.reference}</p>
                )}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePray(post.id)}
                    className="text-xs border-[#d8d8c8] text-[#666] hover:bg-[#f4f6f0] rounded-full px-3 py-1 flex items-center gap-1"
                  >
                    Join in Prayer
                  </Button>
                  <div className="flex items-center text-[#666] text-xs">
                    <Heart size={12} className="mr-1 fill-[#e5deff] text-[#6e59a5]" />
                    <span>{post.prayerCount} prayers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
