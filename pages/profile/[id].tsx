import axios from "axios";

import { BASE_URL } from "../../utils"
import { User, Video } from "../../types";
import VideoCard from "../../components/videoCard/VideoCard";
import NoResults from "../../components/noResults/NoResults";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { GoVerified } from "react-icons/go";
import { useEffect, useState } from "react";

interface ProfileProps {
  data: {
    user: User,
    userPosts: Video[],
    userLiked: Video[],
  }
};

const Profile: React.FC<ProfileProps> = ({ data }) => {
  const { user, userPosts, userLiked } = data;

  const [showUserVideos, setShowUserVideos] = useState<boolean>(true);
  const [videosList, setVideosList] = useState<Video[]>([]);


  const showVideosClass = showUserVideos 
    ? 'border-b-2 border-black'
    : 'text-gray-400'
  ;
  const showLikedClass = !showUserVideos 
    ? 'border-b-2 border-black'
    : 'text-gray-400'
  ;

  useEffect(() => {
    if (showUserVideos) {
      setVideosList(userPosts); 
    } else {
      setVideosList(userLiked);
    }
  }, [showUserVideos, userLiked, userPosts]);


  return (
    <div className="w-full">
      <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
        <div className='w-16 h-16 md:w-32 md:h-32 '>
          <Image
            src={user.image}
            width={120}
            height={120}
            alt={user.userName}
            className='rounded-full'
          />
        </div>

        <div className='flex flex-col justify-center'>
          <p className='md:text-2xl tracking-wider flex gap-1 justify-center items-center text-md font-bold text-primary lowercase'>
            {user.userName.replaceAll(' ', '')}
            <GoVerified className='text-blue-400'/>
          </p>

          <p className='md:text-xl capitalize text-gray-400 text-xs'>{user.userName}</p>
        </div>
      </div>

      <div>
        <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
          <p 
            className={`text-xl font-semibold cursor-pointer mt-2 ${showVideosClass}`}
            onClick={() => setShowUserVideos(true)}
          >
            Videos
          </p>
          <p 
            className={`text-xl font-semibold cursor-pointer mt-2 ${showLikedClass}`}
            onClick={() => setShowUserVideos(false)}
          >
            Liked
          </p>
        </div>

        <div className="flex gap-6 flex-wrap md:justify-start">
          {
            videosList.length > 0 ? (
              videosList.map((video: Video, index: number) => (
                <VideoCard post={video} key={video._id}/>
              ))
            ) : (
              <NoResults 
                type={'videos'}
                text={`No ${showUserVideos ? 'videos' : 'liked content'} yet...`} 
              />
            )
          }
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params: { id }
} : { 
  params: { id: string } 
}) => {
  const response = await axios.get(`${BASE_URL}/api/profile/${id}`);
  
  const { data } = response;

  return {
    props: {
      data,
    }
  }
}

export default Profile;