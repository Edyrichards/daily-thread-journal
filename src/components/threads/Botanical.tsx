import { SVGProps } from 'react';

/** Small feather — the Threads of Grace mark. */
export const Feather = ({ className, ...p }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
    <path d="M20.5 4.5c-5.5-1-12 1.5-14.5 7C4.5 14.5 4.5 18 5 19.5" />
    <path d="M5.2 19.3 18 6.6" />
    <path d="M16.5 5.2 11 7M18.2 8.4 12.5 10.4M19 11.8 14 13.8M9.2 9.5 7.4 14.6M12.4 12.7 10.6 17.4" />
  </svg>
);

/** A two-leaf sprig used as a section ornament / divider. */
export const LeafSprig = ({ className, ...p }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
    <path d="M16 22V8" />
    <path d="M16 13c0-3 2.4-5.4 5.4-5.4C21.4 10.6 19 13 16 13Z" />
    <path d="M16 13c0-3-2.4-5.4-5.4-5.4C10.6 10.6 13 13 16 13Z" />
    <path d="M16 9.5c0-2.2 1.8-4 4-4C20 7.7 18.2 9.5 16 9.5Z" />
    <path d="M16 9.5c0-2.2-1.8-4-4-4C12 7.7 13.8 9.5 16 9.5Z" />
  </svg>
);

/** Sunrise-with-sprout glyph that sits above page titles. */
export const SunSprout = ({ className, ...p }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 40 22" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
    <path d="M20 20a7 7 0 0 0-14 0M34 20a7 7 0 0 0-14 0" opacity="0" />
    <path d="M13 21a7 7 0 0 1 14 0" />
    <path d="M20 21V10M20 13c0-2 1.6-3.6 3.6-3.6C23.6 11.4 22 13 20 13ZM20 13c0-2-1.6-3.6-3.6-3.6C16.4 11.4 18 13 20 13Z" />
    <path d="M9 16l-2.5-1M31 16l2.5-1M11 11l-2-2M29 11l2-2" />
  </svg>
);

/** A thin horizontal divider with a centered sprig. */
export const SprigDivider = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className || ''}`}>
    <span className="h-px w-10 bg-line" />
    <LeafSprig className="h-3.5 w-5 text-gold" />
    <span className="h-px w-10 bg-line" />
  </div>
);

type FaceType = 'joyful' | 'peaceful' | 'overwhelmed' | 'grateful' | 'sad' | 'neutral';

/** Delicate line-art mood faces. */
export const MoodFace = ({ type, className }: { type: FaceType; className?: string }) => {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (type === 'grateful') {
    // praying hands
    return (
      <svg viewBox="0 0 32 32" className={className} {...common}>
        <path d="M16 26c-3.5-1.2-7-3.6-7-7.5V9l3.2 1.2L16 6.5l3.8 3.7L23 9v9.5c0 3.9-3.5 6.3-7 7.5Z" />
        <path d="M16 10.5v13" />
      </svg>
    );
  }
  const mouth =
    type === 'joyful' ? 'M11 19c1.5 2.4 8.5 2.4 10 0'
      : type === 'peaceful' ? 'M12 19.5c1.4 1.3 6.6 1.3 8 0'
      : type === 'sad' || type === 'overwhelmed' ? 'M11 21c1.5-2.4 8.5-2.4 10 0'
      : 'M12 20h8';
  const eyes =
    type === 'peaceful'
      ? <><path d="M10.5 13.5c.8-.9 2.2-.9 3 0" /><path d="M18.5 13.5c.8-.9 2.2-.9 3 0" /></>
      : <><circle cx="12" cy="13.5" r="0.9" fill="currentColor" stroke="none" /><circle cx="20" cy="13.5" r="0.9" fill="currentColor" stroke="none" /></>;
  return (
    <svg viewBox="0 0 32 32" className={className} {...common}>
      <circle cx="16" cy="16" r="12" />
      {eyes}
      <path d={mouth} />
    </svg>
  );
};
