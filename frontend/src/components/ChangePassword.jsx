import { useState } from 'react';
import { X, Eye, EyeOff, Key } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore'; // Sesuaikan path sesuai struktur folder Anda

export default function PasswordChangePopup({ isOpen, onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { changePassword, isChangingPassword } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
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
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await changePassword(newPassword);
      
      setNewPassword('');
      setConfirmPassword('');
      
      onClose();
    } catch (error) {
      setError('Failed to change password. Please try again.',error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
     <div className="bg-[#1c1c1c] w-80 max-w-md rounded-lg shadow-lg overflow-hidden border border-gray-800 pb-5">
        {/* Header with title and close button */}
        <div className="flex justify-between items-center pt-6 px-4 pb-6">
          <h2 className="text-xl font-medium text-white">Change Password</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 -mt-3" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-4">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-2 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* New Password Field */}
          <div className="mb-3">
            <label className="block text-gray-400 text-sm mb-1" htmlFor="new-password">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={18} className="text-gray-500" />
              </div>
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 p-2 bg-[#111111] border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500"
                placeholder="Enter new password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isSubmitting}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* Confirm Password Field */}
          <div className="mb-5">
            <label className="block text-gray-400 text-sm mb-1" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={18} className="text-gray-500" />
              </div>
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 p-2 bg-[#111111] border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500"
                placeholder="Confirm new password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#222222] hover:bg-[#111111] text-white font-medium py-2 rounded transition-colors mt-4"
            disabled={isSubmitting}
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}