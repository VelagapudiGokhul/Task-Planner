export function getPrompt(task) {
  return `
    You are a project manager AI assistant.
    Given the task below, provide:

    - An estimated overall timeline.
    - A list of subtasks with timelines.
    - A short procedure for each subtask.
    - A priority for each subtask (low, medium, or high).
    - The dependencies between the subtasks (which tasks must be completed before others can start).

    Task: ${task}

    Please respond in JSON format like this:
    {
    "overall_timeline": "X weeks",
        "subtasks": [
            {
            "title": "Subtask 1",
            "timeline": "Y days",
            "procedure": "Short explanation",
            "priority": "low | medium | high",
            "dependencies": ["Subtask X"] or [] if no dependecy
            }
        ]
    }
`;
}
