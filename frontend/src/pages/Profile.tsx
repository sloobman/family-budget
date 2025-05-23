import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              <p className="mt-1 text-gray-600">Manage your personal information and account settings.</p>
            </div>
            {/* Profile content will be implemented later */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;