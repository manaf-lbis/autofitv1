import React from 'react';
import { Button } from '@/components/ui/button';
import googleLogo from '../../assets/common/googleLogo.webp';

const GoogleLoginButton: React.FC = () => {
  return (
    <Button className="bg-white flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors">
      <img src={googleLogo} alt="Google logo" className="h-5 w-5" />
      <p className="text-sm text-gray-700 font-medium">Continue with Google</p>
    </Button>
  );
};

export default GoogleLoginButton;