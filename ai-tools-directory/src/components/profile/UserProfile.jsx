import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bio, setBio] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profiles/me');
      setProfile(response.data);
      setBio(response.data.bio || '');
      setError('');
    } catch (error) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await api.patch('/profiles/me', { bio });
      setEditing(false);
      await fetchProfile();
    } catch (error) {
      setError('Failed to update profile');
      console.error('Profile update error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">User Information</h2>
            <div className="mt-2 text-sm text-gray-500">
              <p>Username: {user?.username}</p>
              <p>Email: {user?.email}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900">Bio</h2>
            {editing ? (
              <div className="mt-2">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Tell us about yourself..."
                />
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setBio(profile.bio || '');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                {profile?.bio || 'No bio added yet.'}
              </p>
            )}
          </div>

          {profile?.toolHistory?.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900">Recent Tools</h2>
              <ul className="mt-2 divide-y divide-gray-200">
                {profile.toolHistory.map((history) => (
                  <li key={history._id} className="py-3">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {history.tool?.name || 'Deleted Tool'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Used {history.useCount} times
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
