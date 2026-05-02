from PIL import Image
import numpy as np

img = Image.open('client/public/about_top_collage.png').convert('RGBA')
data = np.array(img)

r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# More aggressive threshold - remove near-white and light grey backgrounds
threshold = 245

# Main white background removal
white_mask = (r > threshold) & (g > threshold) & (b > threshold)
data[:,:,3][white_mask] = 0

# Soft fade for edge pixels
for t in range(240, threshold):
    edge_mask = (r > t) & (g > t) & (b > t) & (data[:,:,3] == 255)
    alpha_val = int(255 * (1 - (t - 200) / (threshold - 200)))
    data[:,:,3][edge_mask] = np.clip(alpha_val, 0, 255)

result = Image.fromarray(data)
result.save('client/public/about_top_collage_nobg.png', 'PNG')
print("Done!")
