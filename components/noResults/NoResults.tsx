import React from 'react'
import { BiCommentDots } from 'react-icons/bi'
import { MdOutlineVideocamOff } from 'react-icons/md';


interface NoResultsProps {
  text: string;
  type: string;
}

const NoResults: React.FC<NoResultsProps> = ({text, type}) => {
  return (
    <div
      className='flex flex-col justify-center items-center h-full w-full'
    >
      <p className='text-6xl mb-2 text-gray-400'>
        { type === 'comments' && <BiCommentDots />}
        { type === 'videos' && <MdOutlineVideocamOff />}
      </p>
      <p className='text-2xl'>{text}</p>

    </div>
  )
}

export default NoResults