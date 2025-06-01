import React from 'react';
import userImg from '@/assets/userSide/carworkerImage.png';
import mechImg from '@/assets/mechanicSide/mechanicIMG.png';
import af_logo from '@/assets/common/af_logo.png';
import AdminLoginpageAnimation from '@/components/Animations/admin/LoginPage'; 
import Footer from '@/features/user/components/Footer';

export type Role = 'user' | 'mechanic' | 'admin';

interface LayoutProps {
  children: React.ReactNode;
  role: Role;
}

const config: Record<Role, { bg: string; image: string | React.FC }> = {
  user: { bg: 'bg-af_darkBlue', image: userImg },
  mechanic: { bg: 'bg-af_darkBlue', image: mechImg },
  admin: { bg: 'bg-adminBlue', image: AdminLoginpageAnimation },
};

const AuthLayout: React.FC<LayoutProps> = ({ children, role }) => {
  const { bg, image } = config[role];

  return (
    <>
    <section className="flex items-center justify-center px-4 sm:px-6 mt-2 md:mt-0 min-h-screen">
      <div className="w-full max-w-5xl bg-white md:flex rounded-lg shadow-md overflow-hidden relative">
        {/* Left Panel */}
        <div className={`md:w-1/2 w-full ${bg} py-6 relative pb-10 md:pb-40 z-0`}>
          <div className="w-32 pl-5 hidden md:block">
            <img src={af_logo} alt="logo" />
          </div>
          <div className="flex justify-center text-center px-4 mt-4 md:mt-12">
            <h5 className="text-white font-semibold text-xl md:text-3xl">
              Welcome back to <br /> AutoFit!
            </h5>
          </div>

          <div className="w-full md:absolute md:bottom-0 md:left-1/2 md:transform md:-translate-x-1/2">
            {typeof image === 'string' ? (
              <img
                className={`mx-auto mt-6 md:mt-0 ${role !== 'user' ? 'w-8/12' : 'w-10/12'}`}
                src={image}
                alt={role}
              />
            ) : (
              (() => {
                const Component = image;
                return <Component />;
              })()
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 w-full px-6 py-10 bg-white rounded-xl shadow-lg z-10 relative -mt-24 md:mt-0 md:rounded-none md:shadow-none md:px-16">
          {children}
        </div>
      </div>
    </section>
    </>
  );
};

export default AuthLayout;