// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../utils/client';
import { singleUserQuery, userCreatedPostsQuery, userLikedPostsQuery } from '../../../utils/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query;

    const query = singleUserQuery(id);
    const userPostsQuery = userCreatedPostsQuery(id);
    const userLikedQuery = userLikedPostsQuery(id);    

    const user = await client.fetch(query);
    const userPosts = await client.fetch(userPostsQuery);
    const userLiked = await client.fetch(userLikedQuery);

    if (user) {
      res.status(200).json({
        user: user[0],
        userPosts,
        userLiked
      });
    }
  }
}
