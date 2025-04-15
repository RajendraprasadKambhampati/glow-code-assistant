
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { MessageSquareIcon, PlusIcon, SearchIcon, TagIcon, UserIcon, ThumbsUpIcon, RefreshCwIcon } from "lucide-react";
import { getPosts, ForumPost } from '@/services/discussionService';
import { isAuthenticated } from '@/services/authService';

const Forum = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadPosts();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredPosts(posts.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.content.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      ));
    }
  }, [searchTerm, posts]);
  
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast({
        title: "Error",
        description: "Failed to load forum posts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreatePost = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/forum/new');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <div className="vscode-titlebar flex items-center justify-between px-4 py-1.5 text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <MessageSquareIcon size={14} />
          <span>Code Editor - Forum</span>
        </div>
      </div>
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-12 md:w-14 bg-vscode-sidebar border-r border-vscode-border flex flex-col items-center py-4 space-y-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <MessageSquareIcon size={24} />
          </Link>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Discussion Forum</h1>
              <Button 
                onClick={handleCreatePost}
                className="flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                New Post
              </Button>
            </div>
            
            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search posts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={loadPosts}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <RefreshCwIcon className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No posts match your search criteria." : "Be the first to start a discussion!"}
                </p>
                <Button onClick={handleCreatePost}>Create a Post</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                    <Link to={`/forum/${post.id}`} className="block p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <ThumbsUpIcon className="h-3 w-3 mr-1" />
                          {post.likes}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-accent/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <UserIcon className="h-3 w-3 mr-1" />
                          {post.author.name}
                        </div>
                        <div>
                          {formatDate(post.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <MessageSquareIcon className="h-3 w-3 mr-1" />
                          {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
