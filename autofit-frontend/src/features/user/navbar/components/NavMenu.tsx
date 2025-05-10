import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import Dropdown from "./DropDownMenu";

const NavMenu: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) {
    return (
      <Link to="/user/login" className="text-white hidden md:block hover:text-btn_color transition-hover duration-300">
        Get Started
      </Link>
    );
  }

  return (
    <Dropdown>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
    </Dropdown>
  );
};

export default NavMenu;