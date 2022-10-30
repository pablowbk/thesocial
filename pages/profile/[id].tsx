import axios from "axios";

import { BASE_URL } from "../../utils"
import { User, Video } from "../../types";
import VideoCard from "../../components/videoCard/VideoCard";
import NoResults from "../../components/noResults/NoResults";
import { GetServerSideProps } from "next";

interface ProfileProps {
  data: {
    user: User,
    userPosts: Video[],
    userLiked: Video[],
  }
};

const Profile: React.FC<ProfileProps> = ({ data }) => {
  console.log({data})
  return (
    <div>Profile</div>
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