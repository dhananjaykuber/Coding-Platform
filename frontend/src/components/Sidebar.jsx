import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const links = [
  {
    title: 'Add Question',
    url: '/admin/add-question',
  },
  {
    title: 'All Questions',
    url: '/admin/questions',
  },
  {
    title: 'Users',
    url: '/admin/users',
  },
  {
    title: 'Results',
    url: '/admin/result',
  },
];

const Sidebar = ({ children }) => {
  const { user } = useSelector((store) => store.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    if (!user.isAdmin) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="flex h-[89vh]">
      <div className="w-[250px] border-r p-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            className={({ isActive }) =>
              twMerge(
                `${
                  isActive && 'bg-gray-100 font-semibold'
                } block p-2 rounded-md`
              )
            }
            to={link.url}
          >
            {link.title}
          </NavLink>
        ))}
      </div>
      <div className="p-2 overflow-hidden overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
