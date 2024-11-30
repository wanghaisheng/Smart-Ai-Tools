import { connectDB } from '../../../utils/database';
import User from '../../../models/user';
import { verifyToken } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectDB();

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get both users
    const currentUser = await User.findById(user.id);
    const userToFollow = await User.findById(userId);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userId === user.id) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const isFollowing = currentUser.following.includes(userId);
    
    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== user.id);
    } else {
      // Follow
      currentUser.following.push(userId);
      userToFollow.followers.push(user.id);
    }

    await currentUser.save();
    await userToFollow.save();

    return res.status(200).json({
      isFollowing: !isFollowing,
      followersCount: userToFollow.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    console.error('Follow error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
