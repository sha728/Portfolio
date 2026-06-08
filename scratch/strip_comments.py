import re
import os

def strip_html_comments(text):
    return re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)

def strip_css_comments(text):
    return re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)

def strip_js_comments(text):
    result = []
    i = 0
    in_string = None
    while i < len(text):
        ch = text[i]
        if in_string:
            result.append(ch)
            if ch == '\\' and i + 1 < len(text):
                i += 1
                result.append(text[i])
            elif ch == in_string:
                in_string = None
        elif ch in ('"', "'", '`'):
            in_string = ch
            result.append(ch)
        elif text[i:i+2] == '//':
            while i < len(text) and text[i] != '\n':
                i += 1
            continue
        elif text[i:i+2] == '/*':
            while i < len(text) and text[i:i+2] != '*/':
                i += 1
            i += 2
            continue
        else:
            result.append(ch)
        i += 1
    return ''.join(result)

def clean_blank_lines(text, max_consecutive=1):
    lines = text.split('\n')
    cleaned = []
    blank_count = 0
    for line in lines:
        if line.strip() == '':
            blank_count += 1
            if blank_count <= max_consecutive:
                cleaned.append(line)
        else:
            blank_count = 0
            cleaned.append(line)
    return '\n'.join(cleaned)

base = r'e:\Portfolio'

html_path = os.path.join(base, 'index.html')
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()
html = strip_html_comments(html)
html = clean_blank_lines(html, 1)
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print('index.html done - comments stripped')

css_path = os.path.join(base, 'styles.css')
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()
css = strip_css_comments(css)
css = clean_blank_lines(css, 1)
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print('styles.css done - comments stripped')

js_path = os.path.join(base, 'script.js')
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()
js = strip_js_comments(js)
js = clean_blank_lines(js, 1)
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print('script.js done - comments stripped')

print('All files cleaned successfully.')
