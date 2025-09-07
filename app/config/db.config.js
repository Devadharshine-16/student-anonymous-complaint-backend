export default {
  url: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/complaintsDB",
  options: { useNewUrlParser: true, useUnifiedTopology: true }
};
