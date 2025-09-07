import ForumPost from "../models/forum.model.js";

// Create a new forum post
export const createPost = async (req, res) => {
    try {
        const payload = { ...req.body };
        
        console.log("Received payload:", payload);
        
        // Validate required fields
        if (!payload.title || !payload.content || !payload.category) {
            return res.status(400).json({
                success: false,
                message: "Title, content, and category are required"
            });
        }

        // Ensure authorName is set
        if (!payload.authorName) {
            payload.authorName = payload.isAnonymous ? 'Anonymous Student' : 'Unknown User';
        }

        // Ensure tags is an array
        if (payload.tags && typeof payload.tags === 'string') {
            payload.tags = payload.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
        }

        // Create the forum post
        const forumPost = new ForumPost(payload);
        await forumPost.save();

        console.log("Forum post created successfully:", forumPost);

        res.status(201).json({
            success: true,
            message: "Forum post created successfully",
            data: forumPost
        });
    } catch (error) {
        console.error("❌ Error creating forum post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create forum post",
            error: error.message
        });
    }
};

// Get all forum posts
export const getAllPosts = async (req, res) => {
    try {
        const { category, search, sortBy = 'recent', page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }
        
        // Build sort object
        let sortObject = {};
        switch (sortBy) {
            case 'recent':
                sortObject = { createdAt: -1 };
                break;
            case 'popular':
                sortObject = { $expr: { $subtract: ['$upvotes', '$downvotes'] } };
                break;
            case 'replies':
                sortObject = { 'replies.length': -1 };
                break;
            case 'views':
                sortObject = { viewCount: -1 };
                break;
            default:
                sortObject = { createdAt: -1 };
        }
        
        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const posts = await ForumPost.find(query)
            .sort(sortObject)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
        
        const total = await ForumPost.countDocuments(query);
        
        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalPosts: total,
                hasNext: skip + posts.length < total,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error("❌ Error fetching forum posts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch forum posts",
            error: error.message
        });
    }
};

// Get a single forum post by ID
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const post = await ForumPost.findById(id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }
        
        // Increment view count
        post.viewCount += 1;
        await post.save();
        
        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error("❌ Error fetching forum post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch forum post",
            error: error.message
        });
    }
};

// Update a forum post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        
        // Remove fields that shouldn't be updated
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.authorId;
        
        const post = await ForumPost.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Forum post updated successfully",
            data: post
        });
    } catch (error) {
        console.error("❌ Error updating forum post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update forum post",
            error: error.message
        });
    }
};

// Delete a forum post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        
        const post = await ForumPost.findByIdAndDelete(id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Forum post deleted successfully"
        });
    } catch (error) {
        console.error("❌ Error deleting forum post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete forum post",
            error: error.message
        });
    }
};

// Add a reply to a forum post
export const addReply = async (req, res) => {
    try {
        const { id } = req.params;
        const replyData = { ...req.body };
        
        if (!replyData.content) {
            return res.status(400).json({
                success: false,
                message: "Reply content is required"
            });
        }
        
        const post = await ForumPost.findById(id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }
        
        // Add the reply
        post.replies.push(replyData);
        post.updatedAt = new Date();
        
        await post.save();
        
        res.status(201).json({
            success: true,
            message: "Reply added successfully",
            data: post
        });
    } catch (error) {
        console.error("❌ Error adding reply:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add reply",
            error: error.message
        });
    }
};

// Vote on a forum post
export const votePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { isUpvote } = req.body;
        
        const post = await ForumPost.findById(id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }
        
        if (isUpvote) {
            post.upvotes += 1;
        } else {
            post.downvotes += 1;
        }
        
        await post.save();
        
        res.status(200).json({
            success: true,
            message: "Vote recorded successfully",
            data: { upvotes: post.upvotes, downvotes: post.downvotes }
        });
    } catch (error) {
        console.error("❌ Error voting on forum post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to record vote",
            error: error.message
        });
    }
};

// Mark a forum post as resolved
export const markPostAsResolved = async (req, res) => {
    try {
        const { id } = req.params;
        
        const post = await ForumPost.findByIdAndUpdate(
            id,
            { isResolved: true, updatedAt: new Date() },
            { new: true }
        );
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Forum post marked as resolved",
            data: post
        });
    } catch (error) {
        console.error("❌ Error marking post as resolved:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark post as resolved",
            error: error.message
        });
    }
};

// Get forum statistics
export const getForumStats = async (req, res) => {
    try {
        const totalPosts = await ForumPost.countDocuments();
        const resolvedPosts = await ForumPost.countDocuments({ isResolved: true });
        const activePosts = await ForumPost.countDocuments({ status: 'active' });
        
        // Get category statistics
        const categoryStats = await ForumPost.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get total replies
        const totalReplies = await ForumPost.aggregate([
            {
                $group: {
                    _id: null,
                    totalReplies: { $sum: { $size: '$replies' } }
                }
            }
        ]);
        
        const stats = {
            totalPosts,
            resolvedPosts,
            activePosts,
            totalReplies: totalReplies[0]?.totalReplies || 0,
            categoryStats: categoryStats.reduce((acc, cat) => {
                acc[cat._id] = cat.count;
                return acc;
            }, {})
        };
        
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("❌ Error fetching forum stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch forum statistics",
            error: error.message
        });
    }
};
