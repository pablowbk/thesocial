import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Video } from '../../types'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { BsFillPlayFill, BsFillPauseFill, BsPlay } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'
import React, { useEffect, useRef, useState } from 'react';

interface VideoCardProps {
  post: Video;
}

const VideoCard: NextPage<VideoCardProps> = ({post}) => {
  const [isHover, setIsHover] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoClick = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
      <div>
        <div className='flex items-center gap-3 p-2 cursor-pointer font-semibold rounded'>
          <div className='md:w-16 md:h-16 w-10 h-10 cursor-pointer'>
            <Link href={`/profile/${post.postedBy._id}`}>
              <>
                {post.postedBy?.image && (
                  <Image 
                    width={62}
                    height={62}
                    src={post.postedBy?.image}
                    alt={post.postedBy?.userName}
                    className="rounded-full"
                  />
                )}
              </>
            </Link>
          </div>
          <div>
            <Link href={`/profile/${post.postedBy._id}`}>
              <div className='flex items-center gap-2'>
                <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                  {post.postedBy?.userName}
                  {' '}
                  <GoVerified 
                    className='text-blue-400 text-md'
                  />
                </p>
                <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>
                  {post.postedBy?.userName}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className='lg:ml-20 flex gap-4'>
        <div 
          className='rounded-3xl relative'
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}  
        >
          <Link href={`/detail/${post._id}`}>
            <video 
              src={post.video.asset.url}
              loop
              className='lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] w-[200px] rounded-2xl cursor-pointer bg-gray-100'
              ref={videoRef}
            >              
            </video>
          </Link>
          {isHover && (
            <div className='absolute bottom-6 cursor-pointer left-0 right-0 flex gap-10 justify-between pl-2 pr-3'>
              {playing ? (
                <button
                  className='text-black text-2xl lg:text-4xl'
                  onClick={handleVideoClick}
                >
                  <BsFillPauseFill />
                </button>
              ) : (
                <button
                  className='text-black text-2xl lg:text-4xl'
                  onClick={handleVideoClick}
                >
                  <BsFillPlayFill />
                </button>
              )}
              {isMuted ? (
                <button
                  className='text-black text-2xl lg:text-4xl'
                  onClick={() => setIsMuted(false)}
                >
                  <HiVolumeOff />
                </button>
              ) : (
                <button
                  className='text-black text-2xl lg:text-4xl'
                  onClick={() => setIsMuted(true)}
                >
                  <HiVolumeUp />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default VideoCard