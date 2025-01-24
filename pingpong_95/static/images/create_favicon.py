import base64
import os

# Simple 16x16 ICO file for a Pong paddle (white rectangle on black background)
ico_data = '''
AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAP//AAD//wAAgAEAAIABAACA
AQAAgAEAAIABAACAAQAAgAEAAIABAAD//wAA//8AAP//AAD//wAA
'''

# Decode and write the ICO file
ico_path = '/home/mar_1/Desktop/Pong_95/pingpong_95/static/images/favicon.ico'
with open(ico_path, 'wb') as f:
    f.write(base64.b64decode(ico_data.strip()))

print(f"Favicon created at: {ico_path}")
