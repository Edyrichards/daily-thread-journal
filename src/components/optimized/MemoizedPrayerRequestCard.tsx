
import React from 'react';
import { PrayerRequestCard } from '@/components/PrayerRequestCard';
import type { PrayerRequest, PrayerComment } from '@/lib/storage';

interface MemoizedPrayerRequestCardProps {
  request: PrayerRequest;
  onPrayClicked: (requestId: string) => void;
  onCommentAdded: (requestId: string, comment: PrayerComment) => void;
}

const MemoizedPrayerRequestCard = React.memo<MemoizedPrayerRequestCardProps>(
  ({ request, onPrayClicked, onCommentAdded }) => {
    return (
      <PrayerRequestCard
        request={request}
        onPrayClicked={onPrayClicked}
        onCommentAdded={onCommentAdded}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.request.id === nextProps.request.id &&
      prevProps.request.prayedCount === nextProps.request.prayedCount &&
      prevProps.request.comments.length === nextProps.request.comments.length
    );
  }
);

MemoizedPrayerRequestCard.displayName = 'MemoizedPrayerRequestCard';

export default MemoizedPrayerRequestCard;
