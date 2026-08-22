---
name: Cyber Command
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b21'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e9'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ebb2ff'
  on-secondary: '#520072'
  secondary-container: '#b600f8'
  on-secondary-container: '#fff6fc'
  tertiary: '#fff3ed'
  on-tertiary: '#4e2600'
  tertiary-container: '#ffd0ae'
  on-tertiary-container: '#924c00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#f8d8ff'
  secondary-fixed-dim: '#ebb2ff'
  on-secondary-fixed: '#320047'
  on-secondary-fixed-variant: '#74009f'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb77f'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6f3900'
  background: '#121318'
  on-background: '#e3e1e9'
  surface-variant: '#34343a'
  bg-obsidian: '#050608'
  surface-glass: rgba(16, 20, 28, 0.6)
  neon-green: '#39FF14'
  neon-red: '#FF3131'
  cyber-border: rgba(0, 240, 255, 0.2)
typography:
  headline-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The brand personality is high-octane, academic, and technologically advanced. It positions the university experience as a high-tech operation, empowering students with real-time data and seamless connectivity.

The design style is **Glassmorphism mixed with Cyber-Minimalism**. It utilizes deep obsidian layers to create a sense of infinite depth, while vibrant neon accents provide functional "glow" to interactive elements. The aesthetic mimics a heads-up display (HUD), prioritizing clarity of data and high-energy visual feedback.

## Colors
The palette is anchored in a "True Dark" foundation. 

- **Primary (Electric Blue):** Used for "live" states, active indicators, and primary actions. It should feel like it's emitting light.
- **Secondary (Cyber Purple):** Used for social features, community events, and creative highlights.
- **Accent (BMU Orange):** Reserved for high-priority alerts, deadlines, and critical campus updates.
- **Backgrounds:** Use `bg-obsidian` for the base layer and `neutral_color_hex` for content containers.
- **Glassmorphism:** Surfaces use `surface-glass` with a 12px-20px backdrop blur and a 1px stroke of `cyber-border` to define edges in the dark environment.

## Typography
The typography strategy creates a contrast between "Human" content and "System" data.

- **Sora** is used for headlines to provide a modern, wide-track geometric feel that looks futuristic yet welcoming.
- **Hanken Grotesk** handles body content with high legibility and a clean, professional finish.
- **JetBrains Mono** is the "Command Center" font. It is used for timestamps, student IDs, course codes, and status labels to reinforce the high-tech, technical aesthetic.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Desktop views utilize a 12-column grid with generous 24px gutters to allow the glassmorphism effects to breathe. On mobile, a single-column layout with 20px margins is preferred.

Space is used to create "groupings of intelligence." Elements are tightly packed within glass modules (8px-12px internal padding) but those modules are separated by larger vertical stacks (24px-48px) to prevent the UI from feeling cluttered.

## Elevation & Depth
Depth is not communicated through traditional shadows, but through **Tonal Stacking and Glow**.

1.  **Floor:** `#050608` (The deep void).
2.  **Base Layer:** `#0A0B10` for secondary sections.
3.  **Glass Layer:** `surface-glass` with backdrop-filter: blur(16px).
4.  **Interactive Layer:** Elements that are hovered or active should gain a `0px 0px 15px` outer glow matching their accent color (Blue, Purple, or Orange).

Use subtle 1px gradients on borders (top-left to bottom-right) to simulate a light source from the top-left of the screen.

## Shapes
The design system uses "Soft Tech" geometry. While the world is digital, the interaction points are user-friendly.

Standard components use a **4px (0.25rem)** radius for a sharp, precision-engineered look. Larger card containers and modal sheets use a **12px (0.75rem)** radius to feel modern and sophisticated. Avoid fully rounded pill shapes unless used for status tags or "Live" indicators.

## Components

- **Glass Cards:** The primary container. Must have a 1px border using `cyber-border` and a subtle inner glow. 
- **Neon Buttons:** Primary buttons are solid Electric Blue with black text for maximum contrast. Secondary buttons are Ghost style with a Purple border and 10% Purple fill.
- **Status Chips:** Use `JetBrains Mono` for text. "Live" classes or events should have a pulsing dot icon next to the label.
- **Data Inputs:** Dark backgrounds with a 1px bottom border. On focus, the border should glow Electric Blue and the label should animate upwards using the Mono font.
- **HUD Widgets:** Small, square-ish glass modules used for quick-glance data like "Bus Timing," "Cafeteria Menu," or "Current GPA." These should use the Mono font for the primary value.
- **Command Bar:** A floating bottom navigation or search bar with a heavy backdrop blur, acting as the central hub for app navigation.