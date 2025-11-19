# Quick Start Guide: Character Stress Tracker
*Path: [kitty-specs/001-character-stress-tracker/quickstart.md](kitty-specs/001-character-stress-tracker/quickstart.md)*

**Application**: AlienStressManager - Character Stress Tracker
**Version**: 1.0.0
**Date**: 2025-11-19
**Audience**: Alien RPG players and game masters

---

## What is This?

The Character Stress Tracker helps you track your character's stress levels during Alien RPG game sessions. It runs entirely in your browser with no internet connection required - perfect for tabletop gaming anywhere.

**Key Features**:
- Track stress for one character at a time
- Increment (+), decrement (-), and reset stress with simple button clicks
- View action history to see when stress changed
- Switch between English and French languages
- All progress saves automatically - pick up where you left off

---

## Getting Started

### Step 1: Enter Your Character Name

When you first open the app, you'll see a text input field:

1. Click the **Character Name** field
2. Type your character's name (e.g., "Ellen Ripley")
3. Click anywhere outside the field or press Tab

**Result**: The stress tracker interface appears with your character's name displayed and stress counter at 0.

---

## Tracking Stress During Play

### Step 2: Adjust Stress Levels

Use the icon buttons to track stress changes as they happen in the game:

**Increase Stress** (+1):
- Click the **+** button
- Stress increases by 1
- Use this when your character encounters threats, makes risky decisions, or fails rolls

**Decrease Stress** (-1):
- Click the **-** button
- Stress decreases by 1 (but never goes below 0)
- Use this when your character rests, succeeds at calming actions, or conditions improve

**Reset Stress** (back to 0):
- Click the **reset** button (circular arrow icon)
- Stress immediately returns to 0
- Use this between encounters or when starting a new session

**Important**: Stress in Alien RPG has no upper limit - you can track stress well beyond 10 if needed.

---

## Viewing Action History

### Step 3: Check What Happened

Sometimes you need to verify when stress changed during a complex encounter.

**Show Action Log**:
1. Click the **action log toggle** button (history icon)
2. The action history panel appears showing all stress changes this session
3. Each entry shows:
   - **Time** (HH:MM format)
   - **Action** (+1, -1, or Reset to 0)

**Hide Action Log**:
- Click the toggle button again to collapse the log

**Note**: The action log only tracks the current session. When you reload the app, the log clears but your character name and stress level are preserved.

---

## Switching Characters

### Step 4: Track a Different Character

To start tracking a new character:

1. Click the **character name** (it's still editable)
2. Replace the name with your new character's name
3. Click outside the field or press Tab

**What Happens**:
- Stress automatically resets to 0
- Action log clears
- New character name is saved

**Example**: Change from "Ellen Ripley" (stress: 7) to "Ash" (stress: 0 automatically).

---

## Changing Language

### Step 5: Use Your Preferred Language

The app supports **English** and **French**:

1. Locate the **language selector** dropdown at the top of the screen
2. Click it to open the menu
3. Select your preferred language:
   - **English** (Anglais)
   - **Français** (French)

**Result**: All interface text immediately updates to the selected language. Your choice is saved and remembered next time you use the app.

---

## How Your Data is Saved

**Automatic Saving**:
- Character name and stress level save automatically with every change
- Language preference saves when you select a different language
- No "Save" button needed - just use the app naturally

**What Persists**:
- ✅ Character name
- ✅ Current stress level
- ✅ Language preference

**What Doesn't Persist**:
- ❌ Action history log (clears on reload or character name change)

**Note**: All data is stored locally in your browser. No internet connection required. Data stays on your device and is never sent to a server.

---

## Common Questions

**Q: What if I accidentally increment stress too many times?**
A: Use the **-** button to decrease stress back to the correct value. Each click decreases by 1.

**Q: Can I track multiple characters at once?**
A: No, the tracker is designed for one character at a time. To switch characters, edit the name (stress resets automatically).

**Q: Why did my action log disappear?**
A: The action log is session-only. It clears when you:
- Reload the page
- Change the character name
- Close and reopen the app

Your stress level and character name are still saved!

**Q: What happens if I close the browser tab?**
A: Your character name, stress level, and language preference are all saved. Open the app again and you'll see the same character with the same stress level.

**Q: What if my stress needs to go above 10?**
A: No problem! Alien RPG has no upper limit for stress, and neither does this tracker. Just keep clicking the **+** button.

**Q: Can I use this offline?**
A: Yes! The app works completely offline. Once loaded, no internet connection is needed.

---

## Troubleshooting

**Problem**: Changes aren't saving when I reload the page.
- **Cause**: Your browser may be in private/incognito mode, or localStorage is disabled.
- **Solution**: Use a regular browser window, or check your browser settings to enable localStorage.

**Problem**: The interface is too small on my phone.
- **Cause**: The app is responsive but your browser zoom might be affecting it.
- **Solution**: Try adjusting browser zoom (pinch to zoom or use browser settings). The app is designed for mobile, tablet, and desktop.

**Problem**: I see placeholder text instead of French translations.
- **Cause**: Translation files may not have loaded correctly.
- **Solution**: Reload the page. If the problem persists, clear your browser cache.

---

## Keyboard Shortcuts

Currently, the app is optimized for touch/click interactions. Keyboard support:
- **Tab**: Navigate between fields
- **Enter**: (in name field) Same as clicking outside - activates the tracker
- **Spacebar**: (on focused button) Activate the button

**Accessibility**: All buttons have descriptive labels for screen readers.

---

## Tips for Game Masters

**For Players**:
- Share the app link with your players before the session
- Have them enter their character names at the start of play
- Players can track stress independently on their devices

**For Tracking NPCs**:
- You can track one NPC at a time
- For multiple NPCs, consider opening multiple browser tabs (each tracks independently)

**During Intense Scenes**:
- Use the action log to review who did what when stress got high
- Remember: the log clears on reload, so take notes if you need a permanent record

---

## Support & Feedback

This is an open-source project built for Alien RPG enthusiasts.

**Report Issues**: [GitHub Issues](https://github.com/AlienStressManager/issues) (if applicable)

**Game Rules Reference**: This tracker follows stress mechanics from the *Alien RPG Core Rulebook* by Free League Publishing.

---

## Quick Reference Card

| Action | How To |
|--------|--------|
| Start tracking | Enter character name, click outside field |
| Increase stress | Click **+** button |
| Decrease stress | Click **-** button |
| Reset stress | Click **reset** (circular arrow) button |
| View history | Click **action log toggle** (history icon) |
| Change character | Click name, type new name, click outside field |
| Change language | Select language from dropdown at top |

**Remember**: Everything saves automatically. No internet needed.

---

**Ready to play?** Enter your character's name and start tracking stress!
