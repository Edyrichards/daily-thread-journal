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
      content: "Sharing my gratitude for a beautiful sunrise this morning. 🌅 Feeling blessed!",
      reactions: 15,
    },
    {
      id: "2",
      content: "Just finished reading Psalm 23. What a comforting reminder of God's presence. 🙏",
      reactions: 22,
    },
    {
      id: "3",
      content: "Is anyone else struggling with finding time for prayer? Would love to hear your tips! 💬",
      reactions: 8,
    },
    {
      id: "4",
      content: "I'm starting a 30-day gratitude challenge. Join me in posting something you're thankful for each day! #gratitude 🌟",
      reactions: 30,
    },
    {
      id: "5",
      content: "Feeling overwhelmed today, but remembering to trust in God's plan. ❤️",
      reactions: 12,
      hasAudio: true,
    },
  ];

  return (
    <Layout title="Community">
      <div className="space-y-6">
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
