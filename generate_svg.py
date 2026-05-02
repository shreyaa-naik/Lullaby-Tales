import base64
import os

png_path = 'client/public/about_collage_v2.png'
svg_path = 'client/public/about_collage.svg'

if os.path.exists(png_path):
    with open(png_path, 'rb') as f:
        data = f.read()
        b64 = base64.b64encode(data).decode('utf-8')
        
    svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><image width="1024" height="1024" href="data:image/png;base64,{b64}" style="mix-blend-mode: multiply;" /></svg>'
    
    with open(svg_path, 'w') as f:
        f.write(svg_content)
    print(f"Successfully created {svg_path}")
else:
    print(f"Error: {png_path} not found")
