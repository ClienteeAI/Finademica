import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SYSTEM_AVATARS } from '@/lib/feedConfig';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface UserProfile {
  nickname: string;
  avatar_url: string | null;
}

interface FeedPost {
  id: string;
  content: string;
  post_type: string;
  status: string;
  moderation_reason: string | null;
  created_at: string;
  user_id: string;
}

interface FeedPostCardProps {
  post: FeedPost;
  profile?: UserProfile;
  showStatus?: boolean;
}

export function FeedPostCard({ post, profile, showStatus = false }: FeedPostCardProps) {
  const avatar = SYSTEM_AVATARS.find(a => a.id === profile?.avatar_url);
  
  const getStatusBadge = () => {
    switch (post.status) {
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-500 border-red-500/30 bg-red-500/10">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 bg-yellow-500/10">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${avatar?.bg || 'bg-muted'}`}>
              {avatar?.emoji || '👤'}
            </div>
            
            {/* Name & Time */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {profile?.nickname || 'Anonymous'}
                </span>
                {post.post_type === 'achievement' && (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          {/* Status Badge */}
          {showStatus && getStatusBadge()}
        </div>
        
        {/* Content */}
        <p className="text-foreground/90 whitespace-pre-wrap break-words">
          {post.content}
        </p>
        
        {/* Rejection Reason */}
        {showStatus && post.status === 'rejected' && post.moderation_reason && (
          <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">
                {post.moderation_reason}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
