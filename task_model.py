from openai import OpenAI
import sys
import os

client = OpenAI(
    api_key=os.environ.get("API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

if len(sys.argv) < 2:
    print("Provide a task description.")
    sys.exit(1)

task = sys.argv[1]

response = client.responses.create(
    input=f"""
    You are a project manager AI assistant.
    Given the task below, provide:

    - An estimated overall timeline.
    - A list of subtasks with timelines.
    - A short procedure for each subtask.
    - A priority for each subtask (low, medium, or high).
    - The dependencies between the subtasks (which tasks must be completed before others can start).

    Task: {task}

    Please respond in JSON format like this:
    {{
        "overall_timeline": "X weeks",
        "subtasks": [
            {{
                "title": "Subtask 1",
                "timeline": "Y days",
                "procedure": "Short explanation",
                "priority": "low | medium | high",
                "dependencies": ["Subtask X"] or [] if no dependency
            }}
        ]
    }}
    """,
    model="openai/gpt-oss-20b",
)

print(response.output_text)
