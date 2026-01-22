# 🚀 Cosmic Vet Crisis 🐾

A real-time multiplayer retro game where you and your partner work together to diagnose exotic space animals!

## Features

- ✨ **AI-Powered Diagnosis** - Smart answer validation using Claude AI accepts synonyms and natural language
- 🎮 **Retro Pixel Art** - Authentic CRT screen effects with scanlines and flicker
- 🐾 **Animated Sprites** - Custom pixel art for each space animal
- 💫 **Neon Aesthetics** - Classic 80s arcade vibes with glowing UI elements
- 🎯 **Real-time Multiplayer** - WebSocket-powered cooperative gameplay

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API key (optional but recommended):**
   ```bash
   cp .env.example .env
   # Edit .env and add your Anthropic API key
   ```
   Get your API key at https://console.anthropic.com/

   Without an API key, the game uses basic keyword matching.

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open the game:**
   - Open `http://localhost:3000` in two different browsers or tabs
   - Enter your names and click "Find Game"
   - You'll be matched automatically!

## How to Play

- One player gets **Space Tech** clues (environmental/technical readings)
- Other player gets **Vet** clues (biological symptoms and observations)
- Chat together to diagnose the patient within 60 seconds
- Submit your diagnosis before time runs out
- Survive 10 rounds without losing 3 lives to win!

## Game Features

- **10 unique scenarios** combining space tech and veterinary medicine
- **Real-time chat** for coordination
- **Turn-based gameplay** with 60-second timer per round
- **Scoring system** - gain points for correct diagnoses
- **Lives system** - lose lives for wrong answers or timeouts
- **Asymmetric information** - you genuinely need each other to win!

## Technical Stack

- **Backend:** Node.js + Express + Socket.io
- **Frontend:** Vanilla JavaScript + HTML5 + CSS3
- **Real-time:** WebSocket communication

## Tips for Playing

- Communicate quickly and clearly
- Share ALL your clues with your partner
- Think about how space environments affect animals
- Common issues: hypoxia, radiation, temperature, pressure, gravity

## Port Configuration

By default runs on port 3000. To change:
```bash
PORT=8080 npm start
```

Enjoy saving space animals together! 🐾🚀
