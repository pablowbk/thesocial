import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { AiOutlineLogout } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import logo from '../../public/logo-circ-light.svg';
import { createOrGetUser } from "../../utils";
import useAuthStore from "../../store/authStore";
import { GoogleLogout } from "react-google-login";
import { User } from "../../types";
import { useState, useEffect } from "react";

const NavBar = () => {
  const router = useRouter();

  const { userProfile, addUser, logoutUser } = useAuthStore();
  const user: any = userProfile;

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (ev: React.FormEvent) => {
    ev.preventDefault();

    if (searchTerm) router.push(`/search/${searchTerm}`);
  }

  const handleSearchChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault();
    setSearchTerm(ev.target.value);
  }

  return (
    <div className={'w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'}>
      <Link href={'/'}>
        <div className="w-[40px] md:w-[60px] flex items-center cursor-pointer">
          <Image 
            // className={'cursor-pointer'}
            src={logo}
            alt={'The Social'}
          />
        </div>
      </Link>

      <div className="relative hidden md:block">
        <form 
          onSubmit={handleSearch}
          className="absolute md:static top-10 left-20 bg-white"
        >
          <input
            type="text"
            name="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search accounts or videos..."
            className="bg-primary py-3 px-6 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full md:top-0"
          />
          <button 
            type="submit"
            className="absolute md:right-5 right-6 top-4 border-left-2 border-gray-300 pl-4 text-2xl text-gray-400"
          >
            <BiSearch />
          </button>
         </form>
      </div>

      <div>
        {user ? (
          <div className="flex gap-5 md:gap-10">
            <Link href={'/upload'}>
              <button className="border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2 rounded">
                <IoMdAdd className="text-xl" />
                {' '}
                <span className="hidden md:block">Upload</span>
              </button>
            </Link>
            {user?.image && (
              <Link href={`/profile/${user?._id}`}>
                <Image 
                  width={32}
                  height={32}
                  src={user?.image}
                  alt={user?.userName}
                  className="rounded-full cursor-pointer"
                />
              </Link>
            )}
            <button 
              type="button" 
              className="px-2"
              onClick={() => {
                console.log('handeleLoguer')
                googleLogout();
                logoutUser();
              }}
            >
              <AiOutlineLogout color="#d30000" fontSize={20} />
            </button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={credentialResponse => createOrGetUser(
              credentialResponse,
              addUser
            )}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;