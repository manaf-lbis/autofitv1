import React from 'react';
import af_logo from '@/assets/common/af_logo.png'
import mechImage from '@/assets/userSide/carworkerImage.png';


const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section className=" flex items-center justify-center px-4 sm:px-6 mt-2 md:mt-0 min-h-screen">
      <div className="w-full max-w-5xl bg-white md:flex rounded-lg shadow-md overflow-hidden relative">

        {/* Left Section */}
        <div className="md:w-1/2 w-full bg-af_darkBlue py-6 relative pb-10 md:pb-40 z-0">
          <div className="w-32 pl-5 hidden md:block">
            <img src={af_logo} alt="logo" />
          </div>

          <div className="flex justify-center text-center px-4 mt-4 md:mt-12">
            <h5 className="text-white font-semibold text-xl md:text-3xl">
              Welcome back to <br /> AutoFit!
            </h5>
          </div>

          <div className="w-full md:absolute md:bottom-0 md:left-1/2 md:transform md:-translate-x-1/2">
            <img className="w-10/12 mx-auto mt-6 md:mt-0" src={mechImage} alt="Mechanic" />
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 w-full px-6 py-10 bg-white rounded-xl shadow-lg z-10 relative -mt-24 md:mt-0 md:rounded-none md:shadow-none md:px-16">
          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;