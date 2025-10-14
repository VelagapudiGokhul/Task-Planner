import express from "express";
import client from "../apiClient/client.js";
import { getPrompt } from "./prompt.js";
import TaskHistory from "../models/historySchema.js";

const router = express.Router();

router.get("/history", async (req, res) => {
  try {
    const history = await TaskHistory.find().sort({ timestamp: -1 }); 
    res.json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

console.log("start")
router.post("/", async (req, res) => {
  const { task } = req.body;
  
  if (!task) {
    return res.status(400).json({ error: "Task prompt is required." });
  }

  const prompt = getPrompt(task);

  try {
    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });

    let plan = response.output_text.trim();
    if (plan.startsWith("```")) {
      plan = plan.replace(/^```json?\n/, "").replace(/```$/, "").trim();
    }

    let parsedPlan;
    try {
      parsedPlan = JSON.parse(plan);
    } catch (jsonError) {
      return res.status(200).json({
        warning: "Response not valid JSON after cleanup, sending raw output",
        raw_output: plan,
      });
    }

    const taskHistory = new TaskHistory({
      task,
      result: parsedPlan,
    });
    await taskHistory.save(); 
    console.log("Task history saved:", taskHistory);

    res.json({ result: parsedPlan, taskHistory: taskHistory });
  } catch (error) {
    console.error("Error generating plan:", error);
    res.status(500).json({ error: "Failed to generate plan from LLM." });
  }
});

export default router;
