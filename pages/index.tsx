import type { NextPage } from "next";

import axios from 'axios';
import { Video } from "../types";
import VideoCard from "../components/videoCard/VideoCard";
import NoResults from "../components/noResults/NoResults";
import { BASE_URL } from "../utils";

interface HomeProps {
  videos: Video[];
}

 const Home = ({videos}: HomeProps) => {
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos.map((video: Video) => (
          <VideoCard 
            post={video} 
            key={video._id}
          />
        ))
      ) : (
        <NoResults type={'videos'} text={'No videos yet...'}/>
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  const response = await axios.get(`${BASE_URL}/api/post`);

  const { data } = response;

  return {
    props: {
      videos: data,
    }
  }
};

export default Home;