import os
import urllib.request

base_url = "https://shahid-portfolio-1.vercel.app/"
output_dir = r"e:\Portfolio\assets\images"

files = [
    "shahid1.jpeg",
    "project1.png",
    "project2.png",
    "project3.png",
    "certificate1.png",
    "certificate2.png",
    "Certificate4.png",
    "Certificate5.png",
    "certificate3.png"
]

print(f"Downloading assets from {base_url} to {output_dir}...")
os.makedirs(output_dir, exist_ok=True)

for file in files:
    url = f"{base_url}{file}"
    dest = os.path.join(output_dir, file)
    try:
        print(f"Downloading {url} -> {dest}...")
        # Add a User-Agent header to avoid potential blocking
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(dest, 'wb') as out_file:
                out_file.write(response.read())
        print("Success.")
    except Exception as e:
        print(f"Failed to download {file}: {e}")

print("Asset download process completed.")
