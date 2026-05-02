import base64
from PIL import Image

png_path = r'd:\Lullaby Tales\client\public\floral_divider.png'
svg_path = r'd:\Lullaby Tales\client\public\floral_divider.svg'

with Image.open(png_path) as img:
    width, height = img.size

with open(png_path, 'rb') as f:
    encoded = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {width} {height}"><image width="{width}" height="{height}" xlink:href="data:image/png;base64,{encoded}"/></svg>'

with open(svg_path, 'w') as f:
    f.write(svg_content)

print(f"Successfully created floral SVG wrapper at {svg_path}")
