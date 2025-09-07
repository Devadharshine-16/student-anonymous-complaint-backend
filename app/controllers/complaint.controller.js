import Complaint from "../models/complaint.model.js";

// Utility: generate human-readable tracking code like HAPPY-TIGER-123
const ADJECTIVES = [
    "HAPPY","BRAVE","CALM","BRIGHT","SWIFT","BOLD","WISE","KIND","PROUD","LUCKY",
    "NOBLE","SMART","QUICK","FAIR","MERRY","FRESH","KEEN","TRUE","ZESTY","RAPID"
];
const NOUNS = [
    "TIGER","EAGLE","LION","PANDA","FALCON","WHALE","OTTER","WOLF","DRAGON","PHOENIX",
    "DOLPHIN","PANTHER","JAGUAR","HAWK","ORCA","STALLION","BUFFALO","RHINO","COBRA","BEAR"
];

function generateTrackingCode() {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `${adjective}-${noun}-${num}`;
}

function computePriorityFromText(text = "") {
    const lowered = text.toLowerCase();
    if (/(violence|threat|assault|emergency|harass|urgent|immediate)/.test(lowered)) return "Urgent";
    if (/(exam|grade|deadline|security|health|injur|electric|water)/.test(lowered)) return "High";
    if (/(maintenance|delay|request|noise|wifi|internet)/.test(lowered)) return "Medium";
    return "Low";
}

function assessRiskFromText(text = "") {
    const lowered = text.toLowerCase();
    const tags = [];
    let score = 0;
    const add = (tag, s) => { tags.push(tag); score += s; };

    // Self-harm / suicidal ideation
    if (/(suicide|kill myself|end my life|self-harm|self harm|i want to die|i don't want to live|i dont want to live)/.test(lowered)) {
        add('suicidal_ideation', 80);
    }
    // Severe stress / panic
    if (/(panic attack|severe anxiety|extreme stress|depressed|depression|mental breakdown)/.test(lowered)) {
        add('severe_stress', 40);
    }
    // Immediate action keywords
    if (/(immediate action|urgent help|emergency|right now|asap)/.test(lowered)) {
        add('immediate_action', 30);
    }
    // Abuse / harassment
    if (/(bully|harass|abuse|threaten|blackmail)/.test(lowered)) {
        add('harassment', 25);
    }
    // Staff/student conflict
    if (/(staff scolded|teacher scolded|humiliated|insulted)/.test(lowered)) {
        add('conflict_incident', 25);
    }

    // Normalize capping
    if (score > 100) score = 100;
    const isHighRisk = score >= 50 || tags.includes('suicidal_ideation');
    const requiresAttention = !isHighRisk && (score >= 20 || tags.includes('conflict_incident') || tags.includes('harassment'));
    return { isHighRisk, requiresAttention, riskScore: score, riskTags: Array.from(new Set(tags)) };
}

// Create a new complaint
export const createComplaint = async (req, res) => {
    try {
        const payload = { ...req.body };
        if (!payload.studentID) {
            payload.trackingCode = generateTrackingCode();
        }
        if (!payload.priority) {
            const text = `${payload.title || ''} ${payload.category || ''} ${payload.complaint || ''}`;
            payload.priority = computePriorityFromText(text);
        }
        const initialStatus = payload.status || "Pending";
        payload.history = [
            { status: initialStatus, note: "Complaint submitted", changedBy: payload.studentID || "Anonymous" }
        ];
        // Risk assessment
        const riskInput = `${payload.title || ''} ${payload.category || ''} ${payload.complaint || ''}`;
        const risk = assessRiskFromText(riskInput);
        payload.isHighRisk = risk.isHighRisk;
        payload.requiresAttention = risk.requiresAttention;
        payload.riskScore = risk.riskScore;
        payload.riskTags = risk.riskTags;
        const complaint = new Complaint(payload);
        await complaint.save();
        res.status(201).json({
            success: true,
            message: "Complaint created successfully",
            data: complaint
        });
} catch (error) {
    console.error("❌ Error creating complaint:", error);
    res.status(500).json({
        success: false,
        message: "Failed to create complaint",
        error: error.message
    });
}

};

// Get all complaints
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: complaints,
            meta: {
                highRiskCount: complaints.filter(c => c.isHighRisk).length,
                attentionCount: complaints.filter(c => !c.isHighRisk && c.requiresAttention).length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch complaints",
            error: error.message
        });
    }
};

// Get complaints by student ID
export const getComplaintsByStudent = async (req, res) => {
    try {
        const { studentID } = req.params;
        const trackingPattern = /^[A-Z]+-[A-Z]+-\d{3}$/;
        const query = trackingPattern.test(studentID) ? { trackingCode: studentID } : { studentID };
        const complaints = await Complaint.find(query).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user complaints",
            error: error.message
        });
    }
};

// Update complaint
export const updateComplaint = async (req, res) => {
    try {
        const existing = await Complaint.findById(req.params.id);
        const update = { ...req.body };
        const updateOps = { ...update };
        if (existing && update.status && existing.status !== update.status) {
            updateOps.$push = {
                history: {
                    status: update.status,
                    note: update.resolution || null,
                    changedBy: update.assignedTo || "Admin"
                }
            };
        }
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            updateOps,
            { new: true }
        );
        res.json({
            success: true,
            message: "Complaint updated successfully",
            data: complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update complaint",
            error: error.message
        });
    }
};

// Delete complaint
export const deleteComplaint = async (req, res) => {
    try {
        await Complaint.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Complaint deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete complaint",
            error: error.message
        });
    }
};
