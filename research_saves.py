import glob

for f in glob.glob('src/pages/*.tsx'):
    with open(f, 'r') as file:
        content = file.read()
        if 'handleSaveState' in content:
            print(f"--- {f} ---")
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if 'const handleSaveState' in line:
                    for j in range(max(0, i), min(len(lines), i+30)):
                        print(lines[j])
                        if '}' in lines[j] and j > i+3 and ')' in lines[j] and ';' in lines[j]:
                            pass # Just print roughly 30 lines
                    break
