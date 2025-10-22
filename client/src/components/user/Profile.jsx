import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthoContext';


const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Session Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <h2 className="text-lg font-semibold mb-2">Session Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
            </div>
            <div>
              <p><strong>Login Time:</strong> {new Date(user?.loginTime).toLocaleString()}</p>
              <p><strong>Theme:</strong> {user?.preferences?.theme}</p>
              <p><strong>Language:</strong> {user?.preferences?.language}</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        {profile && (
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>First Name:</strong> {profile.profile?.firstName}</p>
                <p><strong>Last Name:</strong> {profile.profile?.lastName}</p>
                <p><strong>Bio:</strong> {profile.profile?.bio || 'Not set'}</p>
              </div>
              <div>
                <p><strong>Member Since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
                <p><strong>Last Updated:</strong> {new Date(profile.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;