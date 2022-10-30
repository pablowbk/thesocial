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

const NavBar = () => {
  const router = useRouter();

  const { userProfile, addUser, logoutUser } = useAuthStore();

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
      <div>
        Search
      </div>
      <div>
        {userProfile ? (
          <div className="flex gap-5 md:gap-10">
            <Link href={'/upload'}>
              <button className="border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2 rounded">
                <IoMdAdd className="text-xl" />
                {' '}
                <span className="hidden md:block">Upload</span>
              </button>
            </Link>
            {userProfile?.image && (
              <Link href={`/profile/${userProfile?._id}`}>
                <Image 
                  width={32}
                  height={32}
                  src={userProfile?.image}
                  alt={userProfile?.userName}
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