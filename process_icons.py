from PIL import Image

def remove_bg(img_path, output_path):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Background is around (208, 209, 209).
        # Icon is White (255, 255, 255).
        # We want to remove the gray background.
        # If pixel is "darker" than the icon (which is white), it's likely background or anti-aliasing blending into background.
        # Let's set a threshold. If all channels are < 230, it's background.
        if item[0] < 230 and item[1] < 230 and item[2] < 230:
             newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    return img

src = "/home/well/.gemini/antigravity/brain/01aa78f2-210a-4321-8761-f9e09b921058/icon128_white_outline_transparent_1763587847612.png"
img = remove_bg(src, "icon128_white_final.png")
print("Background removed")
