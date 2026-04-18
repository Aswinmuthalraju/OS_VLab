import re

with open('.gemini/antigravity/brain/8b6a5fbd-b2bd-4155-8426-e5a1021f29ff/task.md', 'r') as f:
    text = f.read()

text = text.replace('- `[/]` Update MemoryManagementPage.tsx', '- `[x]` Update MemoryManagementPage.tsx')

with open('.gemini/antigravity/brain/8b6a5fbd-b2bd-4155-8426-e5a1021f29ff/task.md', 'w') as f:
    f.write(text)
