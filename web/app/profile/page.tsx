'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import FollowButton from '@/app/components/FollowButton';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface UserStats {
  posts: number;
  comments: number;
  likes: number;
  bookmarks: number;
  followers: number;
  following: number;
}

interface UserPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category?: string;
  country?: string;
  createdAt: string;
  isSponsored?: boolean;
  _count?: {
    likes: number;
    comments: number;
  };
}

interface ProfileUser {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  coverPhoto: string;
  isPremium?: boolean;
  _count?: {
    posts: number;
    comments: number;
    likes: number;
    bookmarks: number;
    followers: number;
    following: number;
  };
}

const categories = [
  'Food', 'Festival', 'Language', 'Tradition', 
  'Lifestyle', 'Art', 'History', 'Religion'
];

const countries = [
  'Japan', 'USA', 'UK', 'France', 'Germany', 'Italy',
  'Spain', 'China', 'India', 'Brazil', 'Mexico',
  'Australia', 'South Korea', 'Thailand', 'Vietnam'
];

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, isLoading, logout, updateUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    posts: 0,
    comments: 0,
    likes: 0,
    bookmarks: 0,
    followers: 0,
    following: 0,
  });
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  
  // Create post form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    country: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userId = searchParams.get('id');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && userId) {
      setIsOwnProfile(user.id === userId);
    } else if (user) {
      setIsOwnProfile(true);
    }
  }, [user, isLoading, router, userId]);

  const fetchUserData = async () => {
    const targetUserId = userId || user?.id;
    if (!targetUserId || !token) return;

    try {
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${targetUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (userResponse.ok) {
        const data = await userResponse.json();
        setProfileUser(data);
        setStats({
          posts: data._count?.posts || 0,
          comments: data._count?.comments || 0,
          likes: data._count?.likes || 0,
          bookmarks: data._count?.bookmarks || 0,
          followers: data._count?.followers || 0,
          following: data._count?.following || 0,
        });
        setFollowersCount(data._count?.followers || 0);
      }

      const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?author=${targetUserId}`);
      if (postsResponse.ok) {
        const data = await postsResponse.json();
        setUserPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, token, userId]);

  const handleAvatarClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleCoverClick = () => {
    if (coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        
        const endpoint = type === 'avatar' ? '/users/avatar' : '/users/cover';
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            [type === 'avatar' ? 'avatarUrl' : 'coverPhoto']: base64String 
          }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setProfileUser(prev => prev ? { ...prev, ...updatedUser } : null);
          updateUser(updatedUser);
          setUploadSuccess(`${type === 'avatar' ? 'Profile picture' : 'Cover photo'} updated successfully!`);
          setTimeout(() => setUploadSuccess(''), 3000);
        } else {
          const errorData = await response.json();
          setUploadError(errorData.message || 'Failed to upload image');
          setTimeout(() => setUploadError(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image');
      setTimeout(() => setUploadError(''), 3000);
    } finally {
      setIsUploading(false);
      if (type === 'avatar' && avatarInputRef.current) {
        avatarInputRef.current.value = '';
      }
      if (type === 'cover' && coverInputRef.current) {
        coverInputRef.current.value = '';
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      setSuccess('✅ Post created successfully!');
      setFormData({ title: '', content: '', category: '', country: '', imageUrl: '' });
      setImagePreview('');
      
      await fetchUserData();
      
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFollowChange = (isFollowing: boolean) => {
    setFollowersCount(prev => isFollowing ? prev + 1 : prev - 1);
  };

  if (isLoading || isLoadingPosts) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  const displayUser = profileUser || user;
  const isOwn = isOwnProfile;

  const tabs = [
    { id: 'posts', label: 'Posts', icon: 'article' },
    { id: 'comments', label: 'Comments', icon: 'chat_bubble' },
    { id: 'bookmarks', label: 'Bookmarks', icon: 'bookmark' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Profile Header with Cover Photo */}
          <motion.div 
            className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Cover Photo */}
            <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary/20 to-secondary/20">
              {displayUser?.coverPhoto ? (
                <img 
                  src={displayUser.coverPhoto} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                  <span className="material-symbols-outlined text-6xl">photo_camera</span>
                </div>
              )}
              {isOwn && (
                <>
                  <button
                    onClick={handleCoverClick}
                    className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-all hover:scale-110 z-10"
                    disabled={isUploading}
                    title="Upload cover photo"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isUploading ? 'progress_activity' : 'photo_camera'}
                    </span>
                  </button>
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    accept="image/*"
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Avatar */}
            <div className="relative px-6 pb-6 -mt-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl sm:text-5xl text-on-primary font-bold overflow-hidden border-4 border-surface">
                    {displayUser?.avatarUrl ? (
                      <img src={displayUser.avatarUrl} alt={displayUser.name} className="w-full h-full object-cover" />
                    ) : (
                      displayUser?.name?.charAt(0) || displayUser?.username?.charAt(0) || '?'
                    )}
                  </div>
                  {isOwn && (
                    <>
                      <button
                        onClick={handleAvatarClick}
                        className="absolute bottom-0 right-0 bg-primary text-on-primary p-1.5 rounded-full shadow-lg hover:opacity-90 transition hover:scale-110 z-10"
                        disabled={isUploading}
                        title="Upload profile picture"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isUploading ? 'progress_activity' : 'edit'}
                        </span>
                      </button>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={(e) => handleImageUpload(e, 'avatar')}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  )}
                  {displayUser?.isPremium && (
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1 border-2 border-surface">
                      <span className="material-symbols-outlined text-[14px] text-white">stars</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
                      {displayUser?.name || displayUser?.username}
                    </h1>
                    {displayUser?.isPremium && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
                        <span className="material-symbols-outlined text-[14px]">stars</span>
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-on-surface-variant text-sm sm:text-base">@{displayUser?.username}</p>
                  {displayUser?.bio && (
                    <p className="text-on-surface-variant text-sm sm:text-base mt-2 max-w-md mx-auto sm:mx-0">
                      {displayUser.bio}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 mt-4">
                    <div>
                      <span className="block text-xl font-bold text-on-surface">{stats.posts}</span>
                      <span className="text-xs sm:text-sm text-on-surface-variant">Posts</span>
                    </div>
                    <Link href={`/followers?id=${displayUser?.id}`}>
                      <div className="cursor-pointer hover:opacity-80 transition">
                        <span className="block text-xl font-bold text-on-surface">{followersCount}</span>
                        <span className="text-xs sm:text-sm text-on-surface-variant">Followers</span>
                      </div>
                    </Link>
                    <Link href={`/followers?id=${displayUser?.id}`}>
                      <div className="cursor-pointer hover:opacity-80 transition">
                        <span className="block text-xl font-bold text-on-surface">{stats.following}</span>
                        <span className="text-xs sm:text-sm text-on-surface-variant">Following</span>
                      </div>
                    </Link>
                    <div>
                      <span className="block text-xl font-bold text-on-surface">{stats.likes}</span>
                      <span className="text-xs sm:text-sm text-on-surface-variant">Likes</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {isOwn ? (
                    <>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium"
                      >
                        + New Post
                      </button>
                      <button
                        onClick={logout}
                        className="px-4 py-2 bg-error text-on-error rounded-lg hover:opacity-90 transition text-sm"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <FollowButton 
                      userId={displayUser?.id || ''} 
                      onFollowChange={handleFollowChange}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Upload Status Messages */}
            {uploadSuccess && (
              <div className="mx-6 mb-4 p-3 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {uploadSuccess}
              </div>
            )}
            {uploadError && (
              <div className="mx-6 mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {uploadError}
              </div>
            )}
            {error && (
              <div className="mx-6 mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mx-6 mb-4 p-3 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg text-sm">
                {success}
              </div>
            )}
          </motion.div>

          {/* Tabs - Only show for own profile */}
          {isOwn && (
            <>
              <div className="mt-6 border-b border-outline-variant">
                <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] sm:text-[20px]">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {activeTab === 'posts' && (
                  <div>
                    {userPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-outline">article</span>
                        <h3 className="text-lg font-medium text-on-surface mt-4">No posts yet</h3>
                        <p className="text-on-surface-variant text-sm mt-1">Share your first cultural story!</p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition"
                        >
                          Create Post
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {userPosts.map((post) => (
                          <Link key={post.id} href={`/post/${post.id}`}>
                            <div className={`bg-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border ${post.isSponsored ? 'border-yellow-400 border-2' : 'border-outline-variant'}`}>
                              {post.imageUrl && (
                                <div className="h-40 bg-surface-container">
                                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-medium text-on-surface line-clamp-1">{post.title}</h3>
                                  {post.isSponsored && (
                                    <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                                      Sponsored
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-on-surface-variant line-clamp-2 mt-1">{post.content}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant">
                                  <span>❤️ {post._count?.likes || 0}</span>
                                  <span>💬 {post._count?.comments || 0}</span>
                                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-outline">chat_bubble</span>
                    <h3 className="text-lg font-medium text-on-surface mt-4">No comments yet</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Your comments will appear here</p>
                  </div>
                )}

                {activeTab === 'bookmarks' && (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-outline">bookmark</span>
                    <h3 className="text-lg font-medium text-on-surface mt-4">No bookmarks yet</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Save posts you love!</p>
                    <Link href="/feed">
                      <button className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition">
                        Browse Feed
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {!isOwn && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-on-surface mb-4">
                Posts by {displayUser?.name || displayUser?.username}
              </h2>
              {userPosts.length === 0 ? (
                <div className="text-center py-12 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-6xl text-outline">article</span>
                  <p className="text-on-surface-variant mt-2">No posts yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userPosts.map((post) => (
                    <Link key={post.id} href={`/post/${post.id}`}>
                      <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-outline-variant">
                        {post.imageUrl && (
                          <div className="h-40 bg-surface-container">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-medium text-on-surface line-clamp-1">{post.title}</h3>
                          <p className="text-sm text-on-surface-variant line-clamp-2 mt-1">{post.content}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant">
                            <span>❤️ {post._count?.likes || 0}</span>
                            <span>💬 {post._count?.comments || 0}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-outline-variant"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-on-surface">📝 Create New Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-surface-container rounded-lg transition"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {error && (
                <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant p-3 rounded-lg mb-4 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="What's your story about?"
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none bg-surface-container-lowest text-on-surface"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Content *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Share your cultural experience..."
                    rows={5}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none bg-surface-container-lowest text-on-surface resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none bg-surface-container-lowest text-on-surface"
                    >
                      <option value="">Select...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none bg-surface-container-lowest text-on-surface"
                    >
                      <option value="">Select...</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Image</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg hover:bg-surface-container-highest transition text-sm"
                    >
                      📷 Upload Image
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-3">
                      <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg border border-outline-variant" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-on-primary py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium"
                >
                  {isSubmitting ? 'Creating post...' : '📤 Publish Post'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
