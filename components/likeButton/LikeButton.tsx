import React, { useEffect, useState } from 'react'
import { MdFavorite } from 'react-icons/md'
import useAuthStore from '../../store/authStore'

interface LikeButtonProps {
  handleLike: () => void;
  handleDislike: () => void;
  likes: any[];
}

const LikeButton = ({handleDislike, handleLike, likes}: LikeButtonProps) => {
  const { userProfile }: any = useAuthStore();

  const [liked, setLiked] = useState(false);
  const filteredLikes = likes?.filter((like) => like._ref === userProfile?._id);
  
  useEffect(() => {
    if (filteredLikes && filteredLikes.length > 0) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes, filteredLikes])
  
  return (
    <div className='flex gap-6'>
      <div className='mt-4 flex flex-col justify-center items-center cursor-pointer'>
        {liked ? (
          <div 
            className='bg-primary rounded-full p-2 md:p-4 text-accent'
            onClick={handleDislike}
          >
            <MdFavorite className='text-lg md:text-2xl' />
          </div>
        ) : (
          <div 
            className='bg-primary rounded-full p-2 md:p-4'
            onClick={handleLike}
          >
            <MdFavorite className='text-lg md:text-2xl' />
          </div>
        )}
        <p className='text-md font-semibold'>
          {likes?.length}
        </p>
      </div>
    </div>
  )
}

export default LikeButton