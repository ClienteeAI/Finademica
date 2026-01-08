-- Drop and recreate v_feed_posts to include is_official
DROP VIEW IF EXISTS public.v_feed_posts;

CREATE VIEW public.v_feed_posts AS
SELECT p.id,
    p.client_id,
    p.user_id,
    p.post_type,
    p.content,
    p.media_urls,
    p.media_storage_paths,
    p.status,
    p.moderation_reason,
    p.moderated_by,
    p.moderated_at,
    p.created_at,
    p.updated_at,
    u.first_name,
    u.last_name,
    u.email,
    up.nickname,
    up.avatar_url,
    COALESCE(l.like_count, 0::bigint)::integer AS like_count,
    (EXISTS ( SELECT 1
           FROM feed_post_likes myl
          WHERE myl.post_id = p.id AND myl.user_id = current_public_user_id() AND myl.client_id = current_client_id())) AS liked_by_me,
    COALESCE(c.comment_count, 0::bigint)::integer AS comment_count,
    p.is_official
   FROM feed_posts p
     LEFT JOIN users u ON u.id = p.user_id
     LEFT JOIN user_profiles up ON up.user_id = p.user_id
     LEFT JOIN ( SELECT feed_post_likes.post_id,
            count(*) AS like_count
           FROM feed_post_likes
          GROUP BY feed_post_likes.post_id) l ON l.post_id = p.id
     LEFT JOIN ( SELECT feed_post_comments.post_id,
            count(*) AS comment_count
           FROM feed_post_comments
          GROUP BY feed_post_comments.post_id) c ON c.post_id = p.id;