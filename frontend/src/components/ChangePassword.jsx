import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

export default function PasswordChangePopup({ isOpen, onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // If validation passes
    setError('');
    
    // Here you would typically make an API call to update the password
    console.log('Password changed successfully');
    
    // Close the popup after successful change
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-black w-80 max-w-md rounded-lg shadow-lg overflow-hidden border border-gray-800">
        {/* Header with title and close button */}
        <div className="flex justify-between items-center p-5">
          <h2 className="text-xl font-medium text-white">Change Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-2 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* New Password Field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="new-password">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}