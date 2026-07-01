# THE MONOLITH 🧱

**The World's First Luxury Brick.** 

An interactive, premium e-commerce experience built for a coding competition. The challenge? Sell the most boring object on the planet—a plain red brick—as a highly desirable luxury artifact without letting the user's attention span drop.

## ✨ Features (The Competition Requirements)

This project satisfies all interactive requirements of the competition brief:

1. **Interactive 3D WebGL:** A dynamic, mouse-tracking 3D brick rendered via React Three Fiber that serves as the hero of the page.
2. **Scrolling Transitions:** A seamless GSAP scroll-pinned section where the 3D brick morphs through four different structural geometries as you scroll.
3. **Mini-Game:** "Smash The Brick"—a fully playable, custom physics HTML5 Canvas arcade game embedded right in the shopping experience.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (React 19)
- **3D Rendering:** Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **Animation:** GSAP (ScrollTrigger)
- **Styling:** CSS Modules with a custom neon/cyberpunk design system
- **Game Engine:** Custom Vanilla JS/HTML5 Canvas physics loop

## 🚀 Getting Started

To run this project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost](http://localhost) with your browser to see the result.

## 🎨 Design Philosophy
The aesthetic relies on extreme contrast: pairing a humble, terra-cotta red clay brick with ultra-modern cyberpunk neon lighting and brutalist typography. This creates a raw aesthetic tension that treats a $49 lump of clay like it's worth $49,000.
