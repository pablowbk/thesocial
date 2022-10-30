import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FaCloudUploadAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import axios from "axios"

import useAuthStore from "../store/authStore"
import { client } from "../utils/client"
import { SanityAssetDocument } from "@sanity/client"
import { topics } from "../utils/constants"
import { BASE_URL } from "../utils"

const acceptedFileTypes = ['video/mp4', 'video/webm', 'video/ogg'];

const Upload = () => {
  const router = useRouter();

  const { userProfile }: {userProfile: any} = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState<SanityAssetDocument | undefined>();
  const [wrongFileType, setWrongFileType] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(topics[0].name);
  const [savingPost, setSavingPost] = useState(false);

  const uploadVideo = async (e: any) => {
    const file = e.target.files[0];
    wrongFileType && setWrongFileType(false);
    setIsLoading(true);

    if (file && acceptedFileTypes.includes(file.type)) {
      client.assets.upload('file', file, {
        contentType: file.type,
        filename: file.name
      })
      .then(data => {
        setVideoSrc(data);
        setIsLoading(false);
      })
    } else {
      setIsLoading(false);
      setWrongFileType(true);
      return false;
    }
  }

  const handleDiscard = () => {
    setVideoSrc(undefined);  
    setCaption("");
    setCategory(topics[0].name);
    setSavingPost(false);
  }

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  }

  const handlePost = async () => {
    if (caption && videoSrc?._id && category) {
      setSavingPost(true);

      const document = {
        _type: 'post',
        caption,
        video: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: videoSrc?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: userProfile?._id,
        },
        topic: category,
      }

      await axios.post(`${BASE_URL}/api/post`, document)
      .then(() => {
        router.push('/')
      })
    }
  };
        
  return (
    <div className="flex w-full h-full absolute left-0 top-[60px] md:top-[78px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center">
      <div className="bg-white rounded-lg xl:h-[80vh] w-[80%] flex gap-6 lg:gap-16 flex-wrap justify-center items-center p-14 pt-6">
        <div>
          <div>
            <p className="text-2xl font-bold">Upload Video</p>
            <p className="text-md text-gray-400 mt-1">Post a Video to share with others </p>
          </div>

          <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-5 cursor-pointer hover:border-accent hover:bg-gray-100 transition-all group">
            {isLoading ? (
              <p>Uploading...</p>
            ) : (
              <div>
                {videoSrc ? (
                  <div>
                    <video 
                      src={videoSrc.url}
                      loop
                      controls
                      className="rounded-xl h-[400px] bg-black"
                    >
                    </video>
                  </div>
                ) : (
                  <label className="cursor-pointer relative">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col items-center justify-center">
                        <p className="font-bold text-xl">
                          <FaCloudUploadAlt className="text-gray-300 text-6xl group-hover:text-accent transition-all"/>
                        </p>
                      </div>
                      <p className="text-gray-400 text-center mt-10 text-sm leading-10">
                        .MP4/.WebM/.ogg <br />
                        720x1280 or higher <br />
                        Up to 10 minutes <br />
                        Less than 2GB
                      </p>
                      <p className="bg-accent text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none">
                        Choose File
                      </p>
                    </div>
                    <input 
                      type={'file'}
                      name={'upload-video'}
                      onChange={uploadVideo}
                      className="w-0 h-0"
                      accept={acceptedFileTypes.join(',')}
                    />
                  {wrongFileType && (
                    <p className="text-red-500 text-sm absolute bottom-1 left-0 right-0 text-center whitespace-nowrap w-max">
                      Incorrect file type selected
                    </p>
                  )}
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pb-10">
          <label className="text-md font-medium">Caption</label>
          <input 
            type="text" 
            value={caption} 
            onChange={handleCaptionChange} 
            className="rounded outline-none text-md border-2 border-gray-200 p-2"
          />

          <label className="text-md font-medium">Choose a Category</label>
          <select
            onChange={handleCategoryChange}
            className="capitalize outline-none border-2 border-gray-200 bg-white text-gray-700 text-md p-2 lg:p-4 rounded cursor-pointer hover:bg-slate-100"
            >
            {topics.map((topic) => (
              <option 
                key={topic.name} 
                value={topic.name}
              >
                {topic.name}
              </option>
            ))}
          </select>
          <div className="flex gap-6 mt-10">
            <button 
              onClick={handleDiscard} 
              type="button"
              className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"              
            >
              Discard
            </button>
            <button 
              onClick={handlePost} 
              type="button"
              className="bg-accent text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"              
            >
              Post
            </button>
          </div>
        </div>
      </div>      
    </div>
  )
}

export default Upload