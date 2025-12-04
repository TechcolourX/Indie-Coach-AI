
import React from 'react';

interface UserAvatarProps {
  firstName: string;
  lastName: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ firstName, lastName }) => {
  const getInitials = () => {
    const firstInitial = firstName ? firstName[0] : '';
    const lastInitial = lastName ? lastName[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-orange-dark-accessible flex items-center justify-center text-sm font-bold text-white shadow-sm">
      {getInitials()}
    </div>
  );
};

export default UserAvatar;