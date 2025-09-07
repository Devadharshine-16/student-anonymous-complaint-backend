import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
    // Identity fields
    name: {
        type: String,
        required: false,
        trim: true
    },
    studentID: {
        type: String,
        required: false,
        trim: true
    },
    trackingCode: {
        type: String,
        required: false,
        trim: true,
        index: true,
        sparse: true
    },

    // Metadata
    title: {
        type: String,
        required: false,
        trim: true
    },
    category: {
        type: String,
        required: false,
        trim: true
    },
    department: {
        type: String,
        required: false,
        trim: true
    },
    contactNumber: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },

    // Core complaint content
    complaint: {
        type: String,
        required: [true, "Complaint description is required"],
        trim: true,
        minlength: [10, "Complaint must be at least 10 characters long"]
    },

    // Additional user-provided context
    witnesses: {
        type: String,
        default: null
    },
    previousComplaints: {
        type: String,
        default: null
    },
    expectedResolution: {
        type: String,
        default: null
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },

    // Workflow
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved", "Rejected"],
        default: "Pending"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Medium"
    },
    assignedTo: {
        type: String,
        default: null
    },
    resolution: {
        type: String,
        default: null
    },
    history: [
        {
            status: {
                type: String,
                enum: ["Pending", "In Progress", "Resolved", "Rejected"],
                required: true
            },
            changedAt: {
                type: Date,
                default: Date.now
            },
            note: {
                type: String,
                default: null
            },
            changedBy: {
                type: String,
                default: null
            }
        }
    ],

    // ML-lite risk assessment
    isHighRisk: {
        type: Boolean,
        default: false,
        index: true
    },
    riskScore: {
        type: Number,
        default: 0
    },
    riskTags: {
        type: [String],
        default: []
    },
    escalated: {
        type: Boolean,
        default: false
    },
    escalatedAt: {
        type: Date,
        default: null
    },
    requiresAttention: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
ComplaintSchema.index({ studentID: 1 });
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ department: 1 });
ComplaintSchema.index({ createdAt: -1 });
ComplaintSchema.index({ trackingCode: 1 }, { unique: true, sparse: true });

const Complaint = mongoose.model("Complaint", ComplaintSchema);

export default Complaint;
