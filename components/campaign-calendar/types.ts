export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface Post {
  id?: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: Date;
  scheduledTime?: string;
  status: PostStatus;
  mediaId?: string;
  media?: string[];
}
