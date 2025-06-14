
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, BarChart3 } from 'lucide-react';

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
      <h2 className="text-2xl font-serif text-foreground text-center mb-8">
        Enhanced Spiritual Tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div 
            key={tool.title}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 border border-gray-200 rounded-2xl"
            onClick={() => navigate(tool.route)}
          >
            <div className="p-6 text-center">
              <tool.icon className={`h-8 w-8 mx-auto mb-3 ${tool.color}`} />
              <h3 className="font-semibold mb-2">{tool.title}</h3>
              <p className="text-sm text-muted-foreground">
                {tool.description}
              </p>
              <span className={`inline-block rounded ${
                tool.badgeVariant === 'outline' 
                  ? 'border border-primary text-primary' 
                  : 'bg-muted'
              } px-2 py-0.5 text-xs font-medium mt-2`}>
                {tool.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EnhancedToolsSection;
