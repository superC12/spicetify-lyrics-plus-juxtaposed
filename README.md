# Lyrics Plus (Juxtaposed Edition)

![preview](preview.png)

Spicetify's Lyrics Plus with a song-info panel, text size buttons and a mini player with synced lyrics.

A modified copy of the [Lyrics Plus](https://github.com/spicetify/cli/tree/main/CustomApps/lyrics-plus) custom app that ships with [Spicetify](https://spicetify.app). Everything the original does is still here: synced, unsynced and karaoke lyrics, the same providers, translation and romanization.

> The preview above is an illustration of the layout, not a screenshot.

## ✨ What's different

- **Song-info panel.** The lyrics page shows a large cover with the title, artist and album beside the lyrics. Windows narrower than 1100px keep the original full-width layout.
- **A− / A+ buttons.** Change the lyrics size in one click. Ctrl + mouse wheel still works.
- **One lyrics button.** The player bar's lyrics button opens the lyrics page and takes you back when clicked again, like Spotify's own. It replaces the separate Lyrics icon in the top bar.
- **Mini player.** Right-click the lyrics button, or use the mini player button on the lyrics page. It has the cover, song, a seek bar, shuffle (including smart shuffle), previous, play, next, repeat, a like button, volume and synced lyrics. Click a line to jump to it.
  - **Drag it anywhere** by its top bar and **resize it** from the bottom-right corner. It remembers where you left it.
  - **Three layouts that follow its size**: **Compact** (short and wide), **Expanded** (square, big cover) and **Lyrics** (tall, lyrics fill the space).
  - **Keep on top**: pops the mini player out into its own always-on-top window, like Spotify's own mini player. Snap it to a corner from the ··· menu.
  - **Full screen**: cover and controls on the left, lyrics on the right, or stacked on a portrait screen. Spotify's own full screen button opens it too. Press Esc to leave.
  - **Lyrics as written, romanized, or both** for Japanese, Korean and Chinese songs (for example "kampeki de usotsuki na kimi wa").
  - **Show only on hover** hides the controls until you point at the player, and gives their space to the lyrics.
  - **Background**: **Dynamic color** (from the cover), **Album cover** (blurred) or **Static color**.
- **Calmer colours.** With "Colorful background" on, the page keeps the song's colour but darkened, so a vivid cover doesn't flood the screen.

The mini player reads lyrics from Spotify first and [LRCLIB](https://lrclib.net) second. For the other providers and translations, open the full lyrics page.

## 📦 Install

Custom apps can't be installed from Marketplace in one click. Marketplace lists this app in its **Apps** tab and links here.

1. Download **`lyrics-plus.zip`** from the [latest release](https://github.com/superC12/spicetify-lyrics-plus-juxtaposed/releases/latest).
2. Extract it into your Spicetify `CustomApps` folder, so you end up with a `CustomApps\lyrics-plus` folder.

   | Platform        | Path                              |
   | --------------- | --------------------------------- |
   | **Windows**     | `%appdata%\spicetify\CustomApps\` |
   | **Linux/macOS** | `~/.config/spicetify/CustomApps/` |

3. Run:

   ```
   spicetify config custom_apps lyrics-plus
   spicetify apply
   ```

Your own `lyrics-plus` folder takes priority over the copy bundled with Spicetify, so this replaces the stock app without touching Spicetify's files.

### Updating

Download the new `lyrics-plus.zip`, extract it over the old folder and run `spicetify apply`.

## ⚙️ Settings

Open the lyrics page, click your profile picture and choose **Lyrics Plus config**. Two options are new:

| Option              | What it does                                                          |
| ------------------- | --------------------------------------------------------------------- |
| **Playbar button**  | Shows the lyrics button in the player bar, replacing Spotify's own. On by default |
| **Song info panel** | Shows the cover, title and artist beside the lyrics                   |

## 🗑️ Uninstall

Delete the `lyrics-plus` folder you added and run `spicetify apply`. Spicetify goes back to its bundled Lyrics Plus. To remove Lyrics Plus entirely:

```
spicetify config custom_apps lyrics-plus-
spicetify apply
```

> [!NOTE]
> Works on Spotify 1.3.6 with Spicetify 2.46.2, and was tested on Spotify 1.3.4 and 1.3.5 with Spicetify 2.45.3. It's based on the Lyrics Plus from Spicetify 2.45.3 and doesn't pick up later fixes to the original automatically. On Spotify 1.3.4 and 1.3.5 the player bar button only appears when something restores the element names those versions removed, which the [Juxtaposed](https://github.com/superC12/spicetify-juxtaposed) theme does.

## 💡 Credits and license

Lyrics Plus is part of [Spicetify CLI](https://github.com/spicetify/cli), written by its contributors. This repo changes `index.js`, `Settings.js`, `PlaybarButton.js`, `Pages.js`, `TabBar.js`, `Utils.js` and `style.css`; every other file in `lyrics-plus` is unmodified.

Like Spicetify CLI, it is licensed under the [GNU LGPL v2.1](LICENSE).

The mini player and song-info panel follow ideas from Juxtopposed's video [I Redesigned the ENTIRE Spotify UI from Scratch](https://youtu.be/suhEIUapSJQ). This is a fan project, not made by or affiliated with Juxtopposed, Spotify or the Spicetify team.

## 📋 Changelog

### v1.4.0

- Shuffle cycles through off, shuffle and smart shuffle like Spotify's own button, wherever Spotify offers smart shuffle. Its tooltip says why when it doesn't.
- Shuffle and repeat sit in a tinted circle with a dot under them when on, and every control presses in when clicked.
- Lyrics, romanization and shuffle helpers are shared with other extensions, such as the DeskThing bridge.
- Each release now comes as `lyrics-plus.zip`, ready to extract into `CustomApps`. The PowerShell updater was removed from this repo.
- Updated for Spotify 1.3.6 with Spicetify 2.46.2.

### v1.3.0

- Shuffle, repeat, like and volume controls in the mini player and full screen.
- Draggable seek ball with time feedback.
- Two-tone like badge beside the title and larger full-screen controls.
- **Show only on hover** gives the controls' space to the lyrics when they're hidden.
- Volume: centred under the controls in landscape and a vertical slider in portrait, with a percentage tooltip. Mute and unmute work on newer Spotify versions and bring back the last volume.
- Long full-screen titles are limited to two lines, with more room for lyrics in portrait.

### v1.2.0

- Full screen covers the player bar, follows the selected background and supports portrait screens. Spotify's full-screen button opens it too.
- Always-on-top window dragging and corner snapping.
- Original, romanized or combined lyrics.

### v1.1.0

- Draggable, resizable mini player with Compact, Expanded and Lyrics layouts, keep-on-top and background choices.

### v1.0.0

- Initial release: song-info panel, lyrics size buttons and calmer colours.
- Player-bar lyrics button opens or closes the lyrics page; right-click opens the mini player. The duplicate top-bar icon is hidden.
- Stable mode tabs when resizing text or re-rendering.
- Spotify 1.3.4 compatibility and readable errors with **Copy details**.
