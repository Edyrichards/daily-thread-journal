
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EnhancedToolsSection: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'Enhanced Journal',
      description: 'Advanced search, tags, and insights',
      icon: BookOpen,
      color: 'text-primary',
      badge: 'New',
      route: '/journal/enhanced'
    },
    {
      title: 'Prayer Insights',
      description: 'Track answered prayers and patterns',
      icon: Heart,
      color: 'text-red-500',
      badge: 'New',
      route: '/prayer/insights'
    },
    {
      title: 'Growth Analytics',
      description: 'Visualize your spiritual journey',
      icon: BarChart3,
      color: 'text-green-500',
      badge: 'New',
      route: '/analytics'
    },
    {
      title: 'Bible Study Tools',
      description: 'Advanced study with insights',
      icon: BarChart3,
      color: 'text-blue-500',
      badge: 'Enhanced',
      badgeVariant: 'outline',
      route: '/bible'
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-serif text-foreground text-center mb-6 md:mb-8">
        Enhanced Spiritual Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tools.map((tool) => (
          <div 
            key={tool.title}
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/90 border border-gray-200 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            onClick={() => navigate(tool.route)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(tool.route)}
            tabIndex={0}
            role="button"
            aria-label={`Open ${tool.title}`}
          >
            <div className="p-4 md:p-6 text-center">
              <tool.icon className={`h-8 w-8 mx-auto mb-3 ${tool.color} group-hover:scale-110 transition-transform duration-200`} />
              <h3 className="font-semibold mb-2 text-sm md:text-base">{tool.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3">
                {tool.description}
              </p>
              <Badge 
                variant={tool.badgeVariant === 'outline' ? 'outline' : 'default'}
                className="text-xs"
              >
                {tool.badge}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EnhancedToolsSection;
