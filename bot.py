import discord
from discord.ext import commands
import json
import os
import subprocess
from dotenv import load_dotenv
from flask import Flask
from threading import Thread

# 1. THE "KEEP ALIVE" SERVER
app = Flask('')

@app.route('/')
def home():
    return "Bot is online and haunting the Wall of Shame."

def run_flask():
    # Render uses port 8080 or 10000 usually; 0.0.0.0 is required for hosting
    app.run(host='0.0.0.0', port=8080)

def keep_alive():
    t = Thread(target=run_flask)
    t.start()

# 2. SETUP & SECRETS
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN') 
REPO_URL = f"https://{GITHUB_TOKEN}@github.com/Tro-ven/the-gay-group.git"

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

DATA_FILE = 'shame_data.json'

# 3. DATA HANDLERS
def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)
    
    if GITHUB_TOKEN:
        try:
            subprocess.run(["git", "add", "shame_data.json"], check=True)
            subprocess.run(["git", "config", "user.name", "Archive-Bot"], check=True)
            subprocess.run(["git", "config", "user.email", "bot@archive.com"], check=True)
            subprocess.run(["git", "commit", "-m", "chore: wall of shame update [skip ci]"], check=True)
            subprocess.run(["git", "push", REPO_URL, "main"], check=True)
            print("Successfully synced to GitHub!")
        except Exception as e:
            print(f"Git Sync Error: {e}")

# 4. COMMANDS
@bot.event
async def on_ready():
    print(f'Logged in as {bot.user.name}')

@bot.command()
async def ayo(ctx):
    if ctx.message.reference:
        replied_msg = await ctx.channel.fetch_message(ctx.message.reference.message_id)
        data = load_data()
        
        if any(item['id'] == replied_msg.id for item in data):
            await ctx.send("This L is already recorded. 💀")
            return

        # Check for images/attachments
        image_url = None
        if replied_msg.attachments:
            # Grab the first attachment if it's an image
            attachment = replied_msg.attachments[0]
            if any(attachment.filename.lower().endswith(ext) for ext in ['png', 'jpg', 'jpeg', 'gif', 'webp']):
                image_url = attachment.url

        new_entry = {
            "id": replied_msg.id,
            "author": str(replied_msg.author.display_name),
            "content": replied_msg.content,
            "image_url": image_url, # New field!
            "timestamp": replied_msg.created_at.strftime("%Y-%m-%d %H:%M")
        }
        
        data.append(new_entry)
        save_data(data)
        await ctx.send(f"Added to the Wall of Shame with evidence. ✅")
    else:
        await ctx.send("Reply to a message to archive the brainrot!")

@bot.command()
async def notayo(ctx):
    if ctx.message.reference:
        msg_id = ctx.message.reference.message_id
        data = load_data()
        original_count = len(data)
        data = [item for item in data if item['id'] != msg_id]
        if len(data) < original_count:
            save_data(data)
            await ctx.send("L removed. They got lucky. 🛡️")
        else:
            await ctx.send("That message isn't in the archive.")

# 5. START THE BOT
if __name__ == "__main__":
    keep_alive() # Starts the web server in a background thread
    bot.run(TOKEN)