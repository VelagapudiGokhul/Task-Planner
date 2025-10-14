import mongoose from "mongoose";

const taskHistorySchema = new mongoose.Schema({
  task: { type: String, required: true },
  result: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

const TaskHistory = mongoose.model("TaskHistory", taskHistorySchema);

export default TaskHistory;
