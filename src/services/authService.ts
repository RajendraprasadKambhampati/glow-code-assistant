
// Service for user authentication
import { toast } from "@/components/ui/use-toast";

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
}

// Mock user authentication functions
let currentUser: User | null = null;

export const getCurrentUser = (): User | null => {
  // Check if we have a user in local state
  if (currentUser) {
    return currentUser;
  }
  
  // Check if we have a user in localStorage
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    return currentUser;
  }
  
  return null;
};

export const login = async (email: string, password: string): Promise<User> => {
  // This would normally call an API endpoint
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock login logic
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  
  // For demo purposes, accept any email with a valid format and any non-empty password
  if (!email.includes('@') || !email.includes('.')) {
    throw new Error("Invalid email format");
  }
  
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  
  // Create a user based on the email
  const user: User = {
    id: `user-${Date.now()}`,
    name: email.split('@')[0],
    email,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
    role: 'user'
  };
  
  // Store the user
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  return user;
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  // This would normally call an API endpoint
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock registration logic
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }
  
  // Basic validation
  if (!email.includes('@') || !email.includes('.')) {
    throw new Error("Invalid email format");
  }
  
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  
  // Create a user
  const user: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
    role: 'user'
  };
  
  // Store the user
  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  return user;
};

export const logout = async (): Promise<void> => {
  // This would normally call an API endpoint
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Clear the user
  currentUser = null;
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
