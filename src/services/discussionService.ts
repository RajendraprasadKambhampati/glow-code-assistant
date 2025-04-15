
// Service for discussion forum features
import { toast } from "@/components/ui/use-toast";

// Types for the discussion forum
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  tags: string[];
  likes: number;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
}

// Mock data for demonstration
const MOCK_POSTS: ForumPost[] = [
  {
    id: "1",
    title: "How to fix 'Cannot read property of undefined' in React?",
    content: "I'm getting this error when trying to access a nested property in my component. Here's my code...",
    author: {
      id: "user1",
      name: "Jane Developer",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jane"
    },
    createdAt: "2025-04-10T14:48:00.000Z",
    tags: ["react", "javascript", "debugging"],
    likes: 5,
    replies: [
      {
        id: "reply1",
        content: "This is a common error when trying to access properties of an object that might be undefined. Try using optional chaining: `obj?.prop?.nestedProp`",
        author: {
          id: "user2",
          name: "Alex Coder",
          avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
        },
        createdAt: "2025-04-10T15:23:00.000Z",
        likes: 8
      }
    ]
  },
  {
    id: "2",
    title: "Best practices for handling API errors in async functions",
    content: "What's the most elegant way to handle errors in async/await functions when making API calls?",
    author: {
      id: "user3",
      name: "Sam Backend",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sam"
    },
    createdAt: "2025-04-12T09:15:00.000Z",
    tags: ["javascript", "async", "error-handling", "api"],
    likes: 12,
    replies: [
      {
        id: "reply2",
        content: "I recommend using try/catch blocks for specific error handling, and also consider creating a wrapper function that handles common API errors.",
        author: {
          id: "user4",
          name: "Taylor ApiExpert",
          avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Taylor"
        },
        createdAt: "2025-04-12T10:42:00.000Z",
        likes: 7
      }
    ]
  }
];

// Mock functions for the forum
export const getPosts = async (): Promise<ForumPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  return [...MOCK_POSTS];
};

export const getPostById = async (id: string): Promise<ForumPost | null> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return MOCK_POSTS.find(post => post.id === id) || null;
};

export const createPost = async (title: string, content: string, tags: string[]): Promise<ForumPost> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  const newPost: ForumPost = {
    id: `post-${Date.now()}`,
    title,
    content,
    author: {
      id: "current-user",
      name: "Current User",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=CurrentUser"
    },
    createdAt: new Date().toISOString(),
    tags,
    likes: 0,
    replies: []
  };
  
  // In a real app, we would send this to the server
  // For demo, we'll just return it
  return newPost;
};

export const addReply = async (postId: string, content: string): Promise<ForumReply> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  const newReply: ForumReply = {
    id: `reply-${Date.now()}`,
    content,
    author: {
      id: "current-user",
      name: "Current User",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=CurrentUser"
    },
    createdAt: new Date().toISOString(),
    likes: 0
  };
  
  // In a real app, we would send this to the server
  // For demo, we'll just return it
  return newReply;
};
