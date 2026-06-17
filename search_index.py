import re

with open('index.html', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if any(w in line for w in ['Yes', 'WIN', 'tagline', 'badge', '$', 'dollar']):
            print(f"{i}: {line.strip()}")
