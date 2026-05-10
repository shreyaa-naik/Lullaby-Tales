import base64
from PIL import Image
import numpy as np

input_path = r'd:\Lullaby Tales\client\public\floral_divider.png'
output_path = r'd:\Lullaby Tales\client\public\floral_divider.png'

# Load image and convert white/cream background to transparent
img = Image.open(input_path).convert('RGBA')
data = np.array(img)
r = data[..., 0]
g = data[..., 1]
b = data[..., 2]

# Target white or cream-like colors (warm off-whites)
# Typical cream is around (245, 235, 220)
white_mask = (r > 230) & (g > 220) & (b > 210)
data[..., 3][white_mask] = 0

cleaned_img = Image.fromarray(data)
cleaned_img.save(output_path, 'PNG')

print(f"Successfully removed background from {input_path}")
