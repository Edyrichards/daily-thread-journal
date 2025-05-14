
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

interface CommunityPost {
  id: string;
  content: string;
  reactions: number;
  hasAudio?: boolean;
}

const CommunityPage = () => {
  const posts: CommunityPost[] = [
    {
      id: "1",
      content: "I'm struggling with doubt, and I need clarity. Prayers appreciated!!",
      reactions: 12,
      hasAudio: true
    },
    {
      id: "2",
      content: "Getting to worship with others today was such a blessing!",
      reactions: 5,
      hasAudio: false
    },
    {
      id: "3",
      content: "When I feel overwhelmed, I hold onto the promise that Jesus is with me",
      reactions: 8,
      hasAudio: true
    },
    {
      id: "4",
      content: "Thank You, God, for Your endless grace and comfort.",
      reactions: 10,
      hasAudio: false
    }
  ];

  return (
    <Layout title="Community">
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="border-[#e8e8e0] shadow-sm rounded-xl">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[#333] font-serif">{post.content}</p>
              </div>
              <div className="flex justify-end items-center mt-3">
                <div className="flex items-center text-sm text-[#666]">
                  <span className="mr-1">🙏</span>
                  <span>{post.reactions}</span>
                </div>
                {post.hasAudio && (
                  <div className="ml-4">
                    <span className="text-[#666]">🎙️</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default CommunityPage;
