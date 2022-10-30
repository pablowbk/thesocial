import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillHome, AiOutlineMenu } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';
import Discover from "../discover/Discover";
import Footer from "../footer/Footer";
import SuggestedAccounts from "../suggested/SuggestedAccounts";

const SideBar = () => {
  const router = useRouter();

  const [showSideBar, setShowSideBar] = useState(true);

  const userProfile = false;

  const normalLink = "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-accent rounded";

  const handleClick = () => {
    setShowSideBar(prev => !prev)
  }

  return (
    <div>
      <div 
        className="xl:hidden m-2 mt-4 text-xl cursor-pointer flex justify-center"
        onClick={handleClick}
      >
        {showSideBar ? <ImCancelCircle /> : <AiOutlineMenu /> }
      </div>
      {
        showSideBar && (
          <div className="xl:w-400 w-20 flex flex-col justify-start mb-10 br-2 border-grey-100 xl:border-0 p-3">
            <div className="xl:border-b-2 border-gray-200 xl:pb-4">
              <Link href={'/'}>
                <div className={normalLink}>
                  <p className="text-2xl flex gap-4">
                    <AiFillHome />
                    <span className="text-xl hidden xl:block">
                      For You
                    </span>
                  </p>
                </div>
              </Link>
            </div>
            <Discover />
            <SuggestedAccounts />
            <Footer />
          </div>
        )
      }
    </div>
  )
}

export default SideBar