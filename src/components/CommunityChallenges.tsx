
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, Target, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  duration: number; // days
  participants: number;
  goal: string;
  isActive: boolean;
  userProgress: number;
  totalSteps: number;
  startDate: number;
  endDate: number;
}

const CommunityChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: '30 Days of Gratitude',
      description: 'Write down 3 things you\'re grateful for each day',
      type: 'daily',
      duration: 30,
      participants: 127,
      goal: 'Practice daily gratitude',
      isActive: true,
      userProgress: 7,
      totalSteps: 30,
      startDate: Date.now() - (7 * 24 * 60 * 60 * 1000),
      endDate: Date.now() + (23 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Prayer Walk Week',
      description: 'Take a 15-minute prayer walk each day this week',
      type: 'weekly',
      duration: 7,
      participants: 89,
      goal: 'Combine prayer with physical activity',
      isActive: true,
      userProgress: 3,
      totalSteps: 7,
      startDate: Date.now() - (3 * 24 * 60 * 60 * 1000),
      endDate: Date.now() + (4 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Scripture Memory Challenge',
      description: 'Memorize one verse each week for a month',
      type: 'monthly',
      duration: 28,
      participants: 156,
      goal: 'Hide God\'s word in your heart',
      isActive: false,
      userProgress: 0,
      totalSteps: 4,
      startDate: Date.now() + (7 * 24 * 60 * 60 * 1000),
      endDate: Date.now() + (35 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [userChallenges, setUserChallenges] = useState<Set<string>>(new Set(['1', '2']));
  const { toast } = useToast();

  const joinChallenge = (challengeId: string) => {
    setUserChallenges(prev => new Set([...prev, challengeId]));
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, participants: challenge.participants + 1 }
          : challenge
      )
    );

    toast({
      title: "Challenge Joined!",
      description: "You've successfully joined the challenge. Let's grow together! 🌱",
    });
  };

  const markProgress = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, userProgress: Math.min(challenge.userProgress + 1, challenge.totalSteps) }
          : challenge
      )
    );

    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.userProgress + 1 === challenge.totalSteps) {
      toast({
        title: "Challenge Completed! 🎉",
        description: `Congratulations on completing "${challenge.title}"!`,
      });
    } else {
      toast({
        title: "Progress Updated",
        description: "Great job on your spiritual discipline!",
      });
    }
  };

  const getTypeColor = (type: Challenge['type']) => {
    switch (type) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemaining = (endDate: number) => {
    const days = Math.ceil((endDate - Date.now()) / (24 * 60 * 60 * 1000));
    return Math.max(0, days);
  };

  const getProgressPercentage = (progress: number, total: number) => {
    return Math.round((progress / total) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy size={20} />
            <span>Community Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Join others in spiritual growth challenges and build lasting habits together.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {challenges.map(challenge => {
          const isJoined = userChallenges.has(challenge.id);
          const isCompleted = challenge.userProgress === challenge.totalSteps;
          const daysRemaining = getDaysRemaining(challenge.endDate);
          
          return (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(challenge.type)}>
                        {challenge.type}
                      </Badge>
                      {!challenge.isActive && (
                        <Badge variant="outline">Starting Soon</Badge>
                      )}
                      {isCompleted && (
                        <Badge className="bg-gold-100 text-gold-800">
                          <CheckCircle size={12} className="mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Users size={14} className="mr-1" />
                      {challenge.participants} joined
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={14} className="mr-1" />
                      {daysRemaining} days left
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Target size={14} />
                  <span>{challenge.goal}</span>
                </div>
                
                {isJoined && challenge.isActive && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your Progress</span>
                      <span>{challenge.userProgress}/{challenge.totalSteps}</span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(challenge.userProgress, challenge.totalSteps)} 
                      className="h-2" 
                    />
                    <p className="text-xs text-muted-foreground">
                      {getProgressPercentage(challenge.userProgress, challenge.totalSteps)}% complete
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  {!isJoined ? (
                    <Button 
                      onClick={() => joinChallenge(challenge.id)}
                      disabled={!challenge.isActive}
                      className="flex-1"
                    >
                      {challenge.isActive ? 'Join Challenge' : 'Coming Soon'}
                    </Button>
                  ) : (
                    <>
                      {challenge.isActive && !isCompleted && (
                        <Button 
                          onClick={() => markProgress(challenge.id)}
                          className="flex-1"
                        >
                          Mark Today Complete
                        </Button>
                      )}
                      {isCompleted && (
                        <Button variant="outline" className="flex-1" disabled>
                          Challenge Completed! 🎉
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityChallenges;
