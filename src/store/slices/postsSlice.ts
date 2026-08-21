import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, Story, Comment as AppComment } from '../../types';
import { INITIAL_POSTS, INITIAL_STORIES } from '../../data/mockData';

export interface PostsState {
  posts: Post[];
  stories: Story[];
  selectedStory: Story | null;
}

const initialState: PostsState = {
  posts: INITIAL_POSTS,
  stories: INITIAL_STORIES,
  selectedStory: null,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
    },
    toggleLikePost: (state, action: PayloadAction<{ postId: string; isLiked: boolean; countDelta: number }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.isLiked = action.payload.isLiked;
        post.likesCount = Math.max(0, post.likesCount + action.payload.countDelta);
      }
    },
    addCommentToPost: (state, action: PayloadAction<{ postId: string; comment: AppComment }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments = post.comments || [];
        post.comments.push(action.payload.comment);
        post.commentsCount = (post.commentsCount || 0) + 1;
      }
    },
    setStories: (state, action: PayloadAction<Story[]>) => {
      state.stories = action.payload;
    },
    addStory: (state, action: PayloadAction<Story>) => {
      state.stories.unshift(action.payload);
    },
    setSelectedStory: (state, action: PayloadAction<Story | null>) => {
      state.selectedStory = action.payload;
    },
  },
});

export const {
  setPosts,
  addPost,
  removePost,
  toggleLikePost,
  addCommentToPost,
  setStories,
  addStory,
  setSelectedStory,
} = postsSlice.actions;

export default postsSlice.reducer;
