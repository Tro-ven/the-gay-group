import discord
from discord.ext import commands
import json
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

# Setup Bot
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

DATA_FILE = 'shame_data.json'

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user.name} (ID: {bot.user.id})')
    print('------')

@bot.command()
async def ayo(ctx):
    # Check if the user is replying to a message
    if ctx.message.reference and ctx.message.reference.message_id:
        replied_msg = await ctx.channel.fetch_message(ctx.message.reference.message_id)
        
        data = load_data()
        
        # Prevent duplicates
        if any(item['id'] == replied_msg.id for item in data):
            await ctx.send("This L is already recorded in the archive. 💀")
            return

        # Add new shame entry
        new_entry = {
            "id": replied_msg.id,
            "author": str(replied_msg.author.display_name),
            "content": replied_msg.content,
            "timestamp": replied_msg.created_at.strftime("%Y-%m-%d %H:%M")
        }
        
        data.append(new_entry)
        save_data(data)
        await ctx.send(f"Added to the Wall of Shame. Justice for {replied_msg.author.mention} is cancelled. ✅")
    else:
        await ctx.send("You need to **reply** to a message to archive the brainrot!")

@bot.command()
async def notayo(ctx):
    if ctx.message.reference and ctx.message.reference.message_id:
        msg_id = ctx.message.reference.message_id
        data = load_data()
        
        # Filter out the message ID
        original_count = len(data)
        data = [item for item in data if item['id'] != msg_id]
        
        if len(data) < original_count:
            save_data(data)
            await ctx.send("L removed. They got lucky this time. 🛡️")
        else:
            await ctx.send("That message isn't even in the archive, bro.")
    else:
        await ctx.send("Reply to the message you want to remove!")

bot.run(TOKEN)