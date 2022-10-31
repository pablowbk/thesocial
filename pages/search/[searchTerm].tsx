import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {useState} from 'react'
import { GoVerified } from 'react-icons/go'
import Discover from '../../components/discover/Discover'
import NoResults from '../../components/noResults/NoResults'
import VideoCard from '../../components/videoCard/VideoCard'
import useAuthStore from '../../store/authStore'
import { User, Video } from '../../types'
import { BASE_URL } from '../../utils'

interface SearchProps {
  videos: Video[];
}

const SearchResult: React.FC<SearchProps> = ({ videos }) => {
  const router = useRouter();
  const { userProfile, allUsers } = useAuthStore();
  const [showAccounts, setShowAccounts] = useState<boolean>(true);

  const searchTerm: any = router.query.searchTerm;

  const showAccountsClass = showAccounts 
    ? 'border-b-2 border-black'
    : 'text-gray-400'
  ;
  const showVideosClass = !showAccounts 
    ? 'border-b-2 border-black'
    : 'text-gray-400'
  ;

  const filteredAccounts = allUsers.filter(
    (user: User) => (
      user.userName
      .toLowerCase()
      .includes(searchTerm?.toLowerCase())
    )
  )
  
  return (
    <div className='w-full'>
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
        <p 
          className={`text-xl font-semibold cursor-pointer mt-2 ${showAccountsClass}`}
          onClick={() => setShowAccounts(true)}
        >
          Accounts
        </p>
        <p 
          className={`text-xl font-semibold cursor-pointer mt-2 ${showVideosClass}`}
          onClick={() => setShowAccounts(false)}
        >
          Videos
        </p>
      </div>

      {showAccounts ? (
        <div className='md:mt-16'>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((user: User) => (
              <Link href={`/profile/${user._id}`}>
                <div className='flex items-center gap-3 p-2 mb-2 font-semibold rounded border-b-2 border-gray-200 cursor-pointer'>
                  <div className=''>
                    <Image
                      src={user.image}
                      width={50}
                      height={50}
                      alt={user.userName}
                      className='rounded-full'
                    />
                  </div>

                  <div className='hidden xl:block'>
                    <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                      {user.userName.replaceAll(' ', '')}
                      <GoVerified className='text-blue-400'/>
                    </p>

                    <p className='capitalize text-gray-400 text-xs'>{user.userName}</p>
                  </div>
                </div>
              </Link>
            ))
            
          ) : (
            <NoResults 
              type='accounts'
              text={`No accounts found for: "${searchTerm}"`}

            />
          )} 
          
        </div>
      ) : (
        <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start'>
          {videos?.length ? (
            videos.map(video => (
              <VideoCard post={video} key={video._id} />
            ))
          ) : (
            <NoResults 
              type="videos" 
              text={`No videos found for: "${searchTerm}"`} 
            />
          )}
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async ({
  params: { searchTerm },
} : { 
  params: { searchTerm: string } 
}) => {
  const response = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);
  const { data } = response;

  return {
    props: {
      videos: data,
    }
  }
}

export default SearchResult