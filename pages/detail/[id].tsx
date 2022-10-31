import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { GoVerified } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import axios from 'axios';
import { BASE_URL } from '../../utils';
import { Video } from '../../types';
import useAuthStore from '../../store/authStore';
import LikeButton from '../../components/likeButton/LikeButton';
import Comments from '../../components/comments/Comments';

interface DetailsProps {
  postDetails: Video,
}

const Detail = ({postDetails}: DetailsProps) => {
  const router = useRouter();

  const { userProfile }: any = useAuthStore();

  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [comment, setComment] = useState('');
  const [isPostingComment, setIsPostingCOmment] = useState(false);
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
    if (post && videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [post, isMuted]);

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const response = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });

      const { data } = response;

      setPost({...post, likes: data.likes});
    }
  };

  const addComment = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (userProfile && comment) {
      setIsPostingCOmment(true);

      const response = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment: comment.replace(/^\s+|\s+$/, ''),
      });

      const { data } = response;

      setPost({...post, comments: data.comments});
      setComment("");
      setIsPostingCOmment(false);
    }
  }

  if (!post) return null;

  return (
    <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
      <div className='relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black bg-no-dash-repeat bg-cover bg-center'>
        <div className='absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
          <p className='cursor-pointer' onClick={() => router.back()}>
            <MdOutlineCancel className='text-white text-[35px]'/>
          </p>
        </div>
        <div className='relative'>
          <div className='lg:h-[100vh] h-[60vh]'>
            <video
              ref={videoRef}
              loop
              onClick={handleVideoClick}
              src={post.video.asset.url}
              className="h-full cursor-pointer"
            >
            </video>
          </div>
          <div className='absolute cursor-pointer top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {!playing && (
              <button
                onClick={handleVideoClick}
              >
                <BsFillPlayFill className='text-white text-6xl lg:text-8xl'/>
              </button>
            )}
          </div>
        </div>

        <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer'>
          {isMuted ? (
            <button
              className='text-white text-2xl lg:text-4xl'
              onClick={() => setIsMuted(false)}
            >
              <HiVolumeOff />
            </button>
          ) : (
            <button
              className='text-white text-2xl lg:text-4xl'
              onClick={() => setIsMuted(true)}
            >
              <HiVolumeUp />
            </button>
          )}
        </div>
      </div>

      <div className='relative w-[1000px] md:w-[900px] lg:w-[700px]'>
        <div className='lg:mt-20 mt-10'>
          <div className='flex items-center gap-3 p-2 cursor-pointer font-semibold rounded'>
            <div className='ml-4 md:w-20 md:h-20 w-16 h-16 flex justify-center items-center'>
              <Link href={`/profile/${post.postedBy?._id}`}>
                {post.postedBy?.image && (
                  <Image 
                    width={62}
                    height={62}
                    src={post.postedBy?.image}
                    alt={post.postedBy?.userName}
                    className="rounded-full"
                  />
                )}
              </Link>
            </div>
            <div>
              <Link href={`/profile/${post.postedBy?._id}`}>
                <div className='flex flex-col gap-2'>
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

          <p className='px-10 text-lg text-gray-600'>
            {post.caption}
          </p>

          <div className='mt-10 px-10'>
            {userProfile && (
              <LikeButton 
                likes={post.likes}
                handleLike={() => handleLike(true)}
                handleDislike={() => handleLike(false)}
              />
            )}

          </div>
          
          <Comments 
            comment={comment}
            setComment={setComment}
            addComment={addComment}
            isPostingComment={isPostingComment}
            comments={post.comments}
          />
        </div>

      </div>
      
    </div>
  )
}

export const getServerSideProps = async ({
  params: { id }
}: {
  params: { id: string }
}) => {
  const response = await axios.get(`${BASE_URL}/api/post/${id}`);

  const { data } = response;

  return {
    props: {
      postDetails: data,
    }
  }
}

export default Detail