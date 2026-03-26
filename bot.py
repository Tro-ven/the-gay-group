import discord
from discord.ext import commands
import os
import random
import io
from dotenv import load_dotenv
from flask import Flask
from threading import Thread
from PIL import Image, ImageDraw, ImageFont

# ==========================================
# 1. KEEP ALIVE SERVER (For Render)
# ==========================================
app = Flask('')

@app.route('/')
def home():
    return "GIF Bot is online and ready to deep-fry messages."

def run_flask():
    app.run(host='0.0.0.0', port=8080)

def keep_alive():
    t = Thread(target=run_flask)
    t.start()

# ==========================================
# 2. BOT SETUP
# ==========================================
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user.name}')
    print('Wall of Shame deleted. GIF mode activated.')

# ==========================================
# 3. TEXT WRAPPER (So text doesn't go off screen)
# ==========================================
def wrap_text(text, font, max_width, draw):
    lines = []
    words = text.split()
    while words:
        line = ''
        # Keep adding words until the line is too wide
        while words and draw.textlength(line + words[0], font=font) <= max_width:
            line += (words.pop(0) + ' ')
        lines.append(line)
    return lines

# ==========================================
# 4. THE "AYO" GIF COMMAND
# ==========================================
@bot.command()
async def ayo(ctx):
    if not ctx.message.reference:
        await ctx.send("Bro, reply to a message to deep-fry it into a GIF!")
        return

    replied_msg = await ctx.channel.fetch_message(ctx.message.reference.message_id)
    text = replied_msg.content
    
    if not text:
        await ctx.send("I can only animate text right now. Words only.")
        return

    # Let the chat know it's cooking
    loading_msg = await ctx.send("Deep frying this message... 🍳")

    try:
        frames = []
        # Neon RGB colors for maximum brainrot
        colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0), (255, 0, 255), (0, 255, 255)]
        font = ImageFont.load_default()
        
        # Base Canvas Size (Small so it looks pixelated/crusty when scaled)
        width, height = 250, 150 
        
        # Dummy draw object just to calculate text wrapping
        dummy_img = Image.new('RGB', (1, 1))
        dummy_draw = ImageDraw.Draw(dummy_img)
        
        # Format the text with quotes and their name
        formatted_text = f'"{text}"\n- {replied_msg.author.display_name}'
        wrapped_lines = wrap_text(formatted_text, font, width - 20, dummy_draw)

        # Generate 10 frames of chaotic shaking
        for i in range(10):
            img = Image.new('RGB', (width, height), color=(15, 15, 15)) # Dark gray background
            draw = ImageDraw.Draw(img)
            
            color = random.choice(colors)
            
            # The "Shake" math (moves the text randomly by a few pixels)
            offset_x = random.randint(-4, 4)
            offset_y = random.randint(-4, 4)
            
            y_text = 20 + offset_y
            for line in wrapped_lines:
                draw.text((10 + offset_x, y_text), line, font=font, fill=color)
                y_text += 15 # Line height
            
            # Scale it up 2x so it looks like a crusty 2012 meme
            img = img.resize((width * 2, height * 2), Image.NEAREST)
            frames.append(img)

        # Save the frames directly to memory (no files cluttering your PC)
        buffer = io.BytesIO()
        frames[0].save(buffer, format='GIF', save_all=True, append_images=frames[1:], duration=50, loop=0)
        buffer.seek(0)

        # Send the GIF back to Discord and delete the loading message
        await ctx.send(file=discord.File(fp=buffer, filename="ayo.gif"))
        await loading_msg.delete()

    except Exception as e:
        await ctx.send(f"The deep fryer broke: {e}")

# ==========================================
# 5. START BOT
# ==========================================
if __name__ == "__main__":
    keep_alive()
    bot.run(TOKEN)