'use client';

import React from 'react';
import { Post, User } from '../../types';
import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react';

interface SellerPostsTabProps {
  posts: Post[];
  currentUser: User;
  onLikePost?: (postId: string) => void;
  onCommentPost?: (postId: string, text: string) => void;
  onDeletePost?: (postId: string) => void;
}

export const SellerPostsTab: React.FC<SellerPostsTabProps> = ({
  posts,
  currentUser,
  onLikePost,
  onCommentPost,
  onDeletePost,
}) => {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 space-y-2">
        <MessageCircle className="w-12 h-12 mx-auto text-slate-300" />
        <p className="text-sm font-bold">No social posts published yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {posts.map((post) => {
        const isAuthor = post.sellerId === currentUser.id;
        return (
          <div
            key={post.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.sellerAvatar}
                  alt={post.sellerName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{post.sellerName}</h4>
                  <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                </div>
              </div>

              {isAuthor && onDeletePost && (
                <button
                  type="button"
                  onClick={() => onDeletePost(post.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  aria-label="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{post.content}</p>

            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="rounded-2xl overflow-hidden max-h-80 bg-slate-900">
                <img
                  src={post.mediaUrls[0]}
                  alt="Post media"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-4 pt-1 border-t border-slate-100 text-xs text-slate-500 font-bold">
              <button
                type="button"
                onClick={() => onLikePost?.(post.id)}
                className={`flex items-center gap-1.5 hover:text-rose-600 transition-colors ${
                  post.isLiked ? 'text-rose-600' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600' : ''}`} />
                <span>{post.likesCount}</span>
              </button>

              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentsCount}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
