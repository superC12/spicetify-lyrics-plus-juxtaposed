# Lyrics Plus (Juxtaposed Edition)

![preview](preview.png)

Spicetify's Lyrics Plus with a song-info panel, text size buttons and a small lyrics pop-up.

A modified copy of the [Lyrics Plus](https://github.com/spicetify/cli/tree/main/CustomApps/lyrics-plus) custom app that ships with [Spicetify](https://spicetify.app). Everything the original does is still here: synced, unsynced and karaoke lyrics, the same providers, translation and romanization.

> The preview above is an illustration of the layout, not a screenshot.

## ✨ What's different

- **Song-info panel.** The lyrics page shows a large cover with the title, artist and album beside the lyrics. Windows narrower than 1100px keep the original full-width layout.
- **A− / A+ buttons.** Change the lyrics size in one click. Ctrl + mouse wheel still works.
- **Lyrics pop-up.** The player bar's lyrics button opens a small window above the bar, so you can read along without leaving the page you're on. It highlights the current line, jumps to a line when you click it, has its own text size, and has a button to open the full lyrics page.
- **Calmer colours.** With "Colorful background" on, the page keeps the song's colour but darkened, so a vivid cover doesn't flood the screen.
- **Player bar button on by default.** It replaces Spotify's own lyrics button. Turn it off under **Lyrics Plus config**.

The pop-up reads lyrics from Spotify first and [LRCLIB](https://lrclib.net) second. It does not use the other providers or translations; open the full page for those.

## 📦 Install

Custom apps can't be installed in one click from Marketplace, so this is a manual install.

1. Download this repo and copy the `lyrics-plus` folder into your Spicetify `CustomApps` folder.

   | Platform        | Path                             |
   | --------------- | -------------------------------- |
   | **Windows**     | `%appdata%\spicetify\CustomApps\` |
   | **Linux/macOS** | `~/.config/spicetify/CustomApps/` |

2. Run:

   ```
   spicetify config custom_apps lyrics-plus
   spicetify apply
   ```

A `lyrics-plus` folder in your own `CustomApps` folder takes priority over the copy bundled with Spicetify, so this replaces the stock app without touching Spicetify's files.

## ⚙️ Settings

Open the lyrics page, click your profile picture and choose **Lyrics Plus config**. Two options are new:

| Option              | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| **Playbar button**  | Shows the lyrics button in the player bar (opens the pop-up)   |
| **Song info panel** | Shows the cover, title and artist beside the lyrics            |

## 🗑️ Uninstall

Delete the `lyrics-plus` folder you copied and run `spicetify apply`. Spicetify goes back to its bundled Lyrics Plus. To remove Lyrics Plus entirely:

```
spicetify config custom_apps lyrics-plus-
spicetify apply
```

> [!NOTE]
> Based on the Lyrics Plus shipped with Spicetify 2.45.3, tested on Spotify 1.3.4 on Windows and checked against 1.3.5. It does not pick up later fixes to the original automatically. On Spotify 1.3.4 and 1.3.5 the player bar button only appears when something restores the element names that version removed, which the [Juxtaposed](https://github.com/superC12/spicetify-juxtaposed) theme does.

## 💡 Credits and license

Lyrics Plus is part of [Spicetify CLI](https://github.com/spicetify/cli), written by its contributors. This repo changes `index.js`, `Settings.js`, `PlaybarButton.js`, `Pages.js`, `TabBar.js`, `Utils.js` and `style.css`; every other file in `lyrics-plus` is unmodified.

Like Spicetify CLI, it is licensed under the [GNU LGPL v2.1](LICENSE).

The lyrics pop-up and song-info panel follow ideas from Juxtopposed's video [I Redesigned the ENTIRE Spotify UI from Scratch](https://youtu.be/suhEIUapSJQ). This is a fan project, not made by or affiliated with Juxtopposed, Spotify or the Spicetify team.

## 📋 Changelog

### v1.0.1

- Fixed the lyrics page crashing with "Something went wrong" on Spotify 1.3.4 and later. Lyrics Plus looked for parts of the page that Spotify removed in that version.
- If the page does crash, it now shows the error with a **Copy details** button instead of a blank page.

### v1.0.0

- Initial release.
