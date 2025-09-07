import mongoose from "mongoose";
import dbConfig from "../config/db.config.js";
import Complaint from "./complaint.model.js";
import Tutorial from "./tutorial.model.js";

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.complaints = Complaint;
db.tutorials = Tutorial;

export default db;
