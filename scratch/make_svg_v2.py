import base64
from PIL import Image
import numpy as np

input_path = r'C:\Users\Shreya\.gemini\antigravity\brain\c58e79ad-14d0-4989-b299-4851b61a4b84\aesthetic_hero_collage_1777635435898.png'
temp_png_path = r'd:\Lullaby Tales\client\public\aesthetic_hero_collage.png'
svg_path = r'd:\Lullaby Tales\client\public\hero_collage.svg'

# Load image and convert white background to transparent
img = Image.open(input_path).convert('RGBA')
data = np.array(img)
r, g, b, a = data.T

# Target pure white or very near white
white_mask = (r > 245) & (g > 245) & (b > 245)
data[..., 3][white_mask.T] = 0

cleaned_img = Image.fromarray(data)
cleaned_img.save(temp_png_path, 'PNG')

# Now convert this cleaned PNG to Base64 SVG
width, height = cleaned_img.size
with open(temp_png_path, 'rb') as f:
    encoded = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {width} {height}"><image width="{width}" height="{height}" xlink:href="data:image/png;base64,{encoded}"/></svg>'

with open(svg_path, 'w') as f:
    f.write(svg_content)

print(f"Successfully created cleaned SVG at {svg_path}")
