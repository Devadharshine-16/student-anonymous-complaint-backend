import mongoose from "mongoose";

const ForumReplySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, "Reply must not be empty"]
    },
    authorId: {
        type: String,
        required: false,
        trim: true
    },
    authorName: {
        type: String,
        required: true,
        trim: true
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    isAcceptedAnswer: {
        type: Boolean,
        default: false
    },
    parentReplyId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const ForumPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Title must be at least 5 characters long"]
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, "Post content must be at least 10 characters long"]
    },
    authorId: {
        type: String,
        required: false,
        trim: true
    },
    authorName: {
        type: String,
        required: [true, "Author name is required"],
        trim: true
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true,
        enum: ["academic", "hostel", "cafeteria", "transport", "facilities", "general"],
        default: "general"
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    replies: [ForumReplySchema],
    isResolved: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "closed", "archived"],
        default: "active"
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
ForumPostSchema.index({ category: 1 });
ForumPostSchema.index({ authorId: 1 });
ForumPostSchema.index({ createdAt: -1 });
ForumPostSchema.index({ isResolved: 1 });
ForumPostSchema.index({ isPinned: 1 });
ForumPostSchema.index({ tags: 1 });
ForumPostSchema.index({ title: "text", content: "text" });

const ForumPost = mongoose.model("ForumPost", ForumPostSchema);

export default ForumPost;
