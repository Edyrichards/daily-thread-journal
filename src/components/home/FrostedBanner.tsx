
import React from 'react';
import SkeletonLoader from '@/components/ui/skeleton-loader';

interface FrostedBannerProps {
  isLoading?: boolean;
}

const FrostedBanner: React.FC<FrostedBannerProps> = ({ isLoading = false }) => {
  return (
    <section className="relative">
      <div className="relative flex items-center justify-center p-3 md:p-5 rounded-3xl overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1766838/pexels-photo-1766838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Calming background"
          className="absolute inset-0 w-full h-full object-cover filter blur-lg brightness-50 scale-105"
        />
        <div className="relative z-10 w-full flex items-center justify-center">
          <div className="w-full max-w-[840px] mx-auto px-4 md:px-6 py-12 md:py-16
            rounded-3xl shadow-2xl bg-white/75 backdrop-blur-xl border border-white/30"
            style={{ boxShadow: "0 8px 40px 8px rgba(0,0,0,0.12)" }}
          >
            {isLoading ? (
              <div className="space-y-6">
                <SkeletonLoader variant="text" lines={3} className="max-w-2xl mx-auto" />
                <SkeletonLoader variant="text" lines={1} className="max-w-xs mx-auto" />
              </div>
            ) : (
              <>
                <blockquote className="text-xl md:text-3xl lg:text-4xl font-serif text-card-foreground mb-6 leading-relaxed italic text-center">
                  " But seek first God's Kingdom, and his righteousness; and all these things will be given to you as well. "
                </blockquote>
                <cite className="text-base md:text-lg lg:text-xl text-muted-foreground font-serif not-italic block text-center">
                  — Matthew 6:33
                </cite>
                <div className="mt-8">
                  <div className="w-12 h-0.5 bg-primary/60 mx-auto opacity-60"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrostedBanner;
