(function PlaybarButton() {
	if (!Spicetify.Platform?.History || !Spicetify.Player || !Spicetify.Playbar) {
		setTimeout(PlaybarButton, 300);
		return;
	}

	const LYRICS_PATH = "/lyrics-plus";
	const KEY = (name) => `lyrics-plus:mini:${name}`;
	const FONT_LIMIT = { min: 12, max: 40, step: 2 };
	const MIN_W = 300;
	const MIN_H = 140;

	const store = {
		get(name, fallback) {
			try {
				const v = localStorage.getItem(KEY(name));
				return v === null ? fallback : JSON.parse(v);
			} catch {
				return fallback;
			}
		},
		set(name, value) {
			try {
				localStorage.setItem(KEY(name), JSON.stringify(value));
			} catch {
				// storage full or blocked: settings just won't persist
			}
		},
	};

	const button = new Spicetify.Playbar.Button(
		"Lyrics Plus",
		`<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" fill="currentColor"><path d="M13.426 2.574a2.831 2.831 0 0 0-4.797 1.55l3.247 3.247a2.831 2.831 0 0 0 1.55-4.797zM10.5 8.118l-2.619-2.62A63303.13 63303.13 0 0 0 4.74 9.075L2.065 12.12a1.287 1.287 0 0 0 1.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 1 1 4.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 0 1-3.933-3.933l2.676-3.045 3.505-3.99z"></path></svg>`,
		// Like Spotify's own lyrics button: open the lyrics page, or go back if it's already open.
		// Right-click opens the mini player instead.
		() => {
			if (Spicetify.Platform.History.location.pathname === LYRICS_PATH) Spicetify.Platform.History.goBack();
			else Spicetify.Platform.History.push(LYRICS_PATH);
		},
		false,
		Spicetify.Platform.History.location.pathname === LYRICS_PATH,
		false
	);
	button.element?.addEventListener("contextmenu", (e) => {
		e.preventDefault();
		toggleMini();
	});
	button.label = "Lyrics (right-click for the mini player)";
	Spicetify.Platform.History.listen((location) => {
		button.active = location.pathname === LYRICS_PATH;
	});

	// ------------------------------------------------------------------ styles
	// One stylesheet, used in Spotify's window and copied into the pinned (always-on-top) window.

	const ICONS = {
		prev: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"/></svg>',
		next: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"/></svg>',
		play: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>',
		pause: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>',
		more: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>',
		pin: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="2.5" width="13" height="10" rx="1.5"/><rect x="8" y="7.5" width="5" height="3.5" rx=".6" fill="currentColor" stroke="none"/></svg>',
		full: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M1.5 5.5v-4h4M10.5 1.5h4v4M14.5 10.5v4h-4M5.5 14.5h-4v-4"/></svg>',
		exitFull: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5.5 1.5v4h-4M14.5 5.5h-4v-4M10.5 14.5v-4h4M1.5 10.5h4v4"/></svg>',
		close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>',
		lyrics: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 4h12M2 8h12M2 12h7"/></svg>',
		shuffle: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 4h2.2c1.2 0 2.3.6 3 1.6l2.6 4.8c.7 1 1.8 1.6 3 1.6h2.2M12.5 10l2 2-2 2M1.5 12h2.2c1.2 0 2.3-.6 3-1.6M9.3 5.6c.7-1 1.8-1.6 3-1.6h2.2M12.5 2l2 2-2 2"/></svg>',
		repeat: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8V6.5A2.5 2.5 0 0 1 4.5 4h9M11.5 2l2 2-2 2M14 8v1.5A2.5 2.5 0 0 1 11.5 12h-9M4.5 10l-2 2 2 2"/></svg>',
		repeatOne: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8V6.5A2.5 2.5 0 0 1 4.5 4h9M11.5 2l2 2-2 2M14 8v1.5A2.5 2.5 0 0 1 11.5 12h-9M4.5 10l-2 2 2 2"/><path d="M7.4 6.6 8.3 6v4" stroke-width="1.3"/></svg>',
		heart: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M8 13.8 2.6 8.6A3.3 3.3 0 0 1 7.3 3.9L8 4.6l.7-.7a3.3 3.3 0 0 1 4.7 4.7L8 13.8z"/></svg>',
		heartFilled: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 13.8 2.6 8.6A3.3 3.3 0 0 1 7.3 3.9L8 4.6l.7-.7a3.3 3.3 0 0 1 4.7 4.7L8 13.8z"/></svg>',
		// Like button: a two-tone badge. Not liked: soft circle with a white heart. Liked: pink circle with the heart cut out of it.
		likeOff: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="currentColor" opacity=".16"/><path fill="currentColor" d="M12 18.4 6.5 13.1a3.7 3.7 0 0 1 5.2-5.2l.3.3.3-.3a3.7 3.7 0 0 1 5.2 5.2z"/></svg>',
		likeOn: '<svg viewBox="0 0 24 24"><path fill="#ff5c93" fill-rule="evenodd" d="M12 0a12 12 0 1 0 0 24 12 12 0 1 0 0-24zm0 18.4 5.5-5.3a3.7 3.7 0 0 0-5.2-5.2l-.3.3-.3-.3a3.7 3.7 0 0 0-5.2 5.2z"/></svg>',
		volume: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h2.5L8 3v10L4.5 10H2zM10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9"/></svg>',
		muted: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h2.5L8 3v10L4.5 10H2zM10.5 6l4 4M14.5 6l-4 4"/></svg>',
	};

	const CSS = `
		.lpm, .lpm * { box-sizing: border-box; }
		.lpm { position: fixed; z-index: 9990; display: flex; flex-direction: column; overflow: hidden; min-width: ${MIN_W}px; min-height: ${MIN_H}px;
			border-radius: 12px; color: #fff; font-family: var(--font-family, "SpotifyMixUI", "CircularSp", system-ui, sans-serif);
			box-shadow: 0 16px 48px rgba(0,0,0,.6); resize: both; isolation: isolate; }
		.lpm.lpm-pinned { position: static; width: 100vw !important; height: 100vh !important; border-radius: 0; resize: none; box-shadow: none; }
		.lpm-bg { position: absolute; inset: 0; z-index: -1; background: var(--lpm-color, #282828); transition: background-color .6s; }
		.lpm-bg img { position: absolute; inset: -40px; width: calc(100% + 80px); height: calc(100% + 80px); object-fit: cover; filter: blur(40px) brightness(.55) saturate(1.3); }
		.lpm-bar { display: flex; align-items: center; gap: 2px; height: 34px; padding: 0 6px 0 12px; cursor: grab; user-select: none; flex: 0 0 auto; }
		.lpm-pinned .lpm-bar { cursor: default; }
		.lpm-bar:active { cursor: grabbing; }
		.lpm-grip { flex: 1; min-width: 0; overflow: hidden; color: rgba(255,255,255,.7); font-size: 12px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
		.lpm-icon { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: rgba(255,255,255,.8); cursor: pointer; flex: 0 0 auto; }
		.lpm-icon:hover { background: rgba(255,255,255,.12); color: #fff; }
		.lpm-icon svg { width: 14px; height: 14px; }
		.lpm-icon.lpm-on { color: var(--spice-button, #1ed760); }
		.lpm-main { flex: 1; min-height: 0; display: grid; gap: 10px; padding: 4px 16px 0; }
		.lpm-art { width: 100%; height: 100%; min-height: 0; object-fit: cover; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.4); background: rgba(255,255,255,.08); }
		/* Song info: title and artist with the like badge beside them */
		.lpm-meta { display: flex; align-items: center; gap: 10px; min-width: 0; text-align: left; }
		.lpm-metatext { flex: 1; min-width: 0; }
		.lpm-title { overflow: hidden; font-size: 16px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
		.lpm-artist { overflow: hidden; color: rgba(255,255,255,.75); font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
		.lpm-lyrics { min-height: 0; overflow-y: auto; padding: 8px 2px 30%; font-size: var(--lpm-font, 18px); font-weight: 700; line-height: 1.35; text-align: center; scrollbar-width: none;
			mask-image: linear-gradient(transparent, #000 15%, #000 80%, transparent); }
		.lpm-lyrics::-webkit-scrollbar { display: none; }
		.lpm-line { margin: 0 0 .65em; color: rgba(255,255,255,.4); transition: color .25s, transform .25s; }
		.lpm-line.lpm-synced { cursor: pointer; }
		.lpm-line.lpm-synced:hover { color: rgba(255,255,255,.75); }
		.lpm-line.lpm-active, .lpm-lyrics.lpm-static .lpm-line { color: #fff; }
		.lpm-message { margin-top: 20%; color: rgba(255,255,255,.6); font-weight: 400; font-size: 14px; }
		.lpm-progress { display: grid; grid-template-columns: 40px 1fr 40px; align-items: center; gap: 8px; padding: 10px 16px 0; font-size: 11px; color: rgba(255,255,255,.75); font-variant-numeric: tabular-nums; flex: 0 0 auto; }
		.lpm-progress span:last-child { text-align: right; }
		.lpm-track { position: relative; height: 4px; border-radius: 2px; background: rgba(255,255,255,.25); cursor: pointer; }
		.lpm-track::before { content: ""; position: absolute; inset: -6px 0; }
		.lpm-fill { position: relative; height: 100%; width: 0; border-radius: 2px; background: #fff; }
		.lpm-track { touch-action: none; transition: height .15s; }
		.lpm-track:hover, .lpm-track.lpm-seeking { height: 6px; border-radius: 3px; }
		/* The ball at the end of the song bar: drag it to seek */
		.lpm-knob { position: absolute; top: 50%; right: -6px; width: 12px; height: 12px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.45);
			transform: translateY(-50%); transition: width .15s, height .15s, right .15s; }
		.lpm-track:hover .lpm-knob, .lpm-track.lpm-seeking .lpm-knob { right: -8px; width: 16px; height: 16px; }
		.lpm-track.lpm-seeking { cursor: grabbing; }
		.lpm-controls { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 8px 0 6px; flex: 0 0 auto; }
		.lpm-ctl.lpm-small { width: 28px; height: 28px; color: rgba(255,255,255,.7); }
		.lpm-ctl.lpm-small svg { width: 15px; height: 15px; }
		.lpm-ctl.lpm-small:hover { color: #fff; }
		.lpm-ctl.lpm-on { color: var(--spice-button, #1ed760); }
		.lpm-dock { flex: 0 0 auto; }
		.lpm-extras { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 0 16px 10px; }
		.lpm-volwrap { display: flex; flex-direction: row-reverse; align-items: center; gap: 6px; }
		.lpm-volume { width: 96px; height: 4px; margin: 0; border-radius: 2px; appearance: none; -webkit-appearance: none; cursor: pointer;
			background: linear-gradient(to right, #fff var(--lpm-vol, 0%), rgba(255,255,255,.25) var(--lpm-vol, 0%)); }
		.lpm-volume::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #fff; opacity: 0; transition: opacity .15s; }
		.lpm-volume:hover::-webkit-slider-thumb, .lpm-volume:active::-webkit-slider-thumb { opacity: 1; }
		.lpm[data-mode="compact"] .lpm-extras { display: none; }
		/* Like: a two-tone badge that pops when tapped */
		.lpm-like { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: #fff; cursor: pointer; transition: transform .15s; }
		.lpm-like svg { width: 100%; height: 100%; filter: drop-shadow(0 2px 6px rgba(0,0,0,.35)); }
		.lpm-like:hover { transform: scale(1.08); }
		.lpm-like.lpm-pop { animation: lpm-pop .35s ease-out; }
		@keyframes lpm-pop { 0% { transform: scale(1); } 40% { transform: scale(1.3); } 100% { transform: scale(1); } }
		/* "Show only on hover": the controls fold away and the lyrics take their space, then unfold when you point at the player.
		   Full screen in landscape keeps its spacing and just fades them. */
		.lpm.lpm-hover-controls .lpm-dock { overflow: hidden; max-height: 0; opacity: 0; transition: max-height .25s ease, opacity .2s; }
		.lpm.lpm-hover-controls:hover .lpm-dock, .lpm.lpm-hover-controls:focus-within .lpm-dock { max-height: 220px; opacity: 1; }
		.lpm.lpm-hover-controls[data-mode="landscape"] .lpm-dock { max-height: none; overflow: visible; }
		/* The like badge beside the title hides and shows with the controls */
		.lpm.lpm-hover-controls .lpm-like { opacity: 0; visibility: hidden; transition: opacity .2s, visibility .2s, transform .15s; }
		.lpm.lpm-hover-controls:hover .lpm-like, .lpm.lpm-hover-controls:focus-within .lpm-like { opacity: 1; visibility: visible; }
		.lpm-ctl { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: #fff; cursor: pointer; }
		.lpm-ctl.lpm-mute { flex-shrink: 0; min-width: 36px; min-height: 36px; position: relative; z-index: 2; }
		.lpm-mute:hover { background: rgba(255,255,255,.12); }
		.lpm-mute:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
		.lpm-ctl svg { width: 16px; height: 16px; }
		.lpm-ctl.lpm-play { width: 40px; height: 40px; background: #fff; color: #000; }
		.lpm-ctl:hover { transform: scale(1.06); }
		.lpm-menu { position: absolute; top: 36px; right: 8px; z-index: 5; min-width: 200px; padding: 6px; border-radius: 8px; background: #282828; box-shadow: 0 12px 32px rgba(0,0,0,.6); font-size: 13px; }
		.lpm-menu h4 { margin: 6px 8px 4px; color: rgba(255,255,255,.6); font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
		.lpm-menu button { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px; border: 0; border-radius: 4px; background: transparent; color: #fff; font-size: 13px; text-align: left; cursor: pointer; }
		.lpm-menu button:hover { background: rgba(255,255,255,.1); }
		.lpm-menu button.lpm-on::after { content: "✓"; margin-left: auto; color: var(--spice-button, #1ed760); }
		.lpm-menu .lpm-row { display: flex; gap: 4px; padding: 2px 4px; }
		.lpm-menu .lpm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
		.lpm-menu .lpm-grid button { padding: 6px 8px; font-size: 12px; }
		.lpm-menu { max-height: calc(100% - 44px); overflow-y: auto; }
		.lpm-roman { display: block; margin-top: .15em; font-size: .62em; font-weight: 600; opacity: .8; }
		.lpm-line.lpm-romanonly .lpm-roman { margin: 0; font-size: 1em; font-weight: 700; opacity: 1; }
		.lpm-menu .lpm-row button { justify-content: center; }

		/* Compact: one row, small cover, no lyrics */
		.lpm[data-mode="compact"] .lpm-main { grid-template-columns: 64px 1fr; align-items: center; }
		.lpm[data-mode="compact"] .lpm-art { width: 64px; height: 64px; }
		.lpm[data-mode="compact"] .lpm-lyrics { display: none; }
		/* Expanded: big cover with the title over it, no lyrics */
		.lpm[data-mode="expanded"] .lpm-main { grid-template-rows: 1fr auto; justify-items: center; }
		.lpm[data-mode="expanded"] .lpm-art { aspect-ratio: 1; width: auto; max-width: 100%; }
		.lpm[data-mode="expanded"] .lpm-meta { justify-self: stretch; }
		.lpm[data-mode="expanded"] .lpm-lyrics { display: none; }
		/* Lyrics: small header with cover and title, lyrics fill the rest */
		.lpm[data-mode="lyrics"] .lpm-main { grid-template-columns: 56px 1fr; grid-template-rows: 56px 1fr; }
		.lpm[data-mode="lyrics"] .lpm-art { width: 56px; height: 56px; }
		.lpm[data-mode="lyrics"] .lpm-meta { align-self: center; }
		.lpm[data-mode="lyrics"] .lpm-lyrics { grid-column: 1 / -1; }

		/* Full screen */
		.lpm.lpm-full { position: fixed; inset: 0; z-index: 2147483000; width: 100vw !important; height: 100vh !important; border-radius: 0; resize: none; box-shadow: none; }
		.lpm.lpm-full .lpm-bar { position: absolute; top: 0; right: 0; left: 0; z-index: 2; height: 56px; padding: 0 16px; background: transparent; opacity: 0; transition: opacity .2s; cursor: default; }
		.lpm.lpm-full:hover .lpm-bar { opacity: 1; }
		.lpm.lpm-full .lpm-main { grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); grid-template-rows: 1fr; gap: 6vw; align-items: center; padding: 8vh 7vw 0; }
		.lpm.lpm-full.lpm-nolyrics .lpm-main { grid-template-columns: 1fr; justify-items: center; }
		.lpm.lpm-full .lpm-side { display: flex; flex-direction: column; align-items: center; gap: 2vh; min-height: 0; }
		.lpm.lpm-full .lpm-art { width: min(42vh, 32vw); height: min(42vh, 32vw); border-radius: 12px; }
		.lpm.lpm-full .lpm-title { font-size: clamp(22px, 3.4vw, 54px); white-space: normal; }
		.lpm.lpm-full .lpm-artist { font-size: clamp(14px, 1.6vw, 26px); }
		.lpm.lpm-full .lpm-dock, .lpm.lpm-full .lpm-meta { width: min(42vh, 32vw); }
		.lpm.lpm-full .lpm-meta { gap: 16px; }
		.lpm.lpm-full .lpm-progress, .lpm.lpm-full .lpm-extras { padding-left: 0; padding-right: 0; }
		/* Bigger, brighter controls in full screen */
		.lpm.lpm-full .lpm-progress { font-size: 13px; }
		.lpm.lpm-full .lpm-controls { gap: 22px; padding: 14px 0 10px; }
		.lpm.lpm-full .lpm-ctl { width: 44px; height: 44px; }
		.lpm.lpm-full .lpm-ctl svg { width: 22px; height: 22px; }
		.lpm.lpm-full .lpm-ctl.lpm-play { width: 64px; height: 64px; }
		.lpm.lpm-full .lpm-ctl.lpm-play svg { width: 26px; height: 26px; }
		.lpm.lpm-full .lpm-ctl.lpm-small { width: 40px; height: 40px; color: rgba(255,255,255,.85); }
		.lpm.lpm-full .lpm-ctl.lpm-small svg { width: 20px; height: 20px; }
		.lpm.lpm-full .lpm-ctl.lpm-small.lpm-on { color: var(--spice-button, #1ed760); }
		.lpm.lpm-full .lpm-like { width: 48px; height: 48px; }
		.lpm.lpm-full .lpm-volume { width: 130px; }
		.lpm.lpm-full .lpm-lyrics { display: block; height: 80vh; font-size: calc(var(--lpm-font, 18px) * 1.8); text-align: left; }
		.lpm.lpm-full.lpm-nolyrics .lpm-lyrics { display: none; }
		/* Full screen on a tall (portrait) screen: cover, song and controls on top, lyrics below */
		.lpm.lpm-full[data-mode="portrait"] .lpm-main { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); gap: 4vh; align-items: stretch; padding: 9vh 8vw 0; }
		.lpm.lpm-full[data-mode="portrait"].lpm-nolyrics .lpm-main { grid-template-rows: 1fr; align-items: center; }
		.lpm.lpm-full[data-mode="portrait"] .lpm-side { gap: 1.6vh; }
		.lpm.lpm-full[data-mode="portrait"] .lpm-art { width: min(34vh, 62vw); height: min(34vh, 62vw); }
		.lpm.lpm-full[data-mode="portrait"] .lpm-title { font-size: clamp(22px, 5vw, 56px); }
		.lpm.lpm-full[data-mode="portrait"] .lpm-artist { font-size: clamp(14px, 2.6vw, 28px); }
		.lpm.lpm-full[data-mode="portrait"] .lpm-dock, .lpm.lpm-full[data-mode="portrait"] .lpm-meta { width: max(min(34vh, 62vw), 280px); }
		/* Portrait: volume as a vertical bar on the left edge with its icon below. It fades with the rest of the controls. */
		.lpm.lpm-full[data-mode="portrait"] .lpm-extras { padding: 0; }
		.lpm.lpm-full[data-mode="portrait"] .lpm-volwrap { position: absolute; left: 3.5vw; top: 50%; transform: translateY(-50%); flex-direction: column; gap: 12px; z-index: 1; }
		.lpm.lpm-full[data-mode="portrait"] .lpm-volume { writing-mode: vertical-lr; direction: rtl; width: 6px; height: clamp(120px, 18vh, 240px); border-radius: 3px;
			background: linear-gradient(to top, #fff var(--lpm-vol, 0%), rgba(255,255,255,.25) var(--lpm-vol, 0%)); }
		.lpm.lpm-full[data-mode="portrait"] .lpm-lyrics { height: auto; min-height: 0; padding-bottom: 20vh; font-size: calc(var(--lpm-font, 18px) * 1.6); text-align: center; }
		.lpm-side { display: contents; }
	`;
	const styleEl = document.createElement("style");
	styleEl.textContent = CSS;

	const hideSpotifyButton = document.createElement("style");
	hideSpotifyButton.innerHTML = `
		[data-testid="lyrics-button"] { display: none !important; }
		li[data-id="/lyrics-plus"] { display: none; }
	`;
	hideSpotifyButton.classList.add("lyrics-plus:visual:playbar-button");

	// With the player bar button on, the separate "Lyrics" icon in the top bar is a duplicate, so hide it.
	// Spicetify gives these icons no stable hook, so match the app's name in any of its languages.
	const APP_NAMES = new Set(["Lyrics", "Dalszöveg", "Letra", "Letras", "Lirik", "Låttext", "Lời bài hát", "Paroles", "Sanat", "Songteksten", "Songtext", "Tekst", "Text", "Şarkı Sözleri", "Στίχοι", "Текст", "الكلمات", "เนื้อเพลง", "歌詞", "歌词"]);
	let hideNavIcon = false;
	function syncNavIcon() {
		for (const el of document.querySelectorAll(".custom-navlinks-scrollable_container button, .custom-navlinks-scrollable_container a")) {
			const label = el.getAttribute("aria-label") ?? el.getAttribute("title") ?? "";
			if (APP_NAMES.has(label.trim())) el.style.display = hideNavIcon ? "none" : "";
		}
	}
	new MutationObserver(() => hideNavIcon && syncNavIcon()).observe(document.body, { childList: true, subtree: true });

	function setPlaybarButton() {
		document.head.appendChild(hideSpotifyButton);
		button.register();
		hideNavIcon = true;
		syncNavIcon();
	}

	function removePlaybarButton() {
		closeMini();
		hideSpotifyButton.remove();
		button.deregister();
		hideNavIcon = false;
		syncNavIcon();
	}

	// On by default; only an explicit "false" turns it off
	if (Spicetify.LocalStorage.get("lyrics-plus:visual:playbar-button") !== "false") setPlaybarButton();
	window.addEventListener("lyrics-plus", (event) => {
		if (event.detail?.name === "playbar-button") event.detail.value ? setPlaybarButton() : removePlaybarButton();
	});

	// ------------------------------------------------------------------ helpers

	const h = (tag, props = {}, ...children) => {
		const el = document.createElement(tag);
		for (const [k, v] of Object.entries(props)) {
			if (k === "class") el.className = v;
			else if (k === "html") el.innerHTML = v;
			else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
			else if (v != null && v !== false) el.setAttribute(k, v === true ? "" : v);
		}
		for (const c of children.flat()) if (c != null && c !== false) el.append(c);
		return el;
	};
	const iconButton = (name, title, onclick, cls = "lpm-icon") => h("button", { type: "button", class: cls, title, "aria-label": title, html: ICONS[name], onclick });
	const fmt = (ms) => {
		const s = Math.max(0, Math.floor((ms || 0) / 1000));
		return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
	};
	const coverUrl = (meta) => {
		const image = meta?.image_xlarge_url || meta?.image_large_url || meta?.image_url || "";
		return image.startsWith("spotify:image:") ? `https://i.scdn.co/image/${image.slice(14)}` : image;
	};

	// Dominant colour of the cover, darkened so white text stays readable
	function coverColor(url) {
		return new Promise((resolve) => {
			if (!url) return resolve(null);
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => {
				try {
					const size = 24;
					const canvas = document.createElement("canvas");
					canvas.width = canvas.height = size;
					const ctx = canvas.getContext("2d", { willReadFrequently: true });
					ctx.drawImage(img, 0, 0, size, size);
					const { data } = ctx.getImageData(0, 0, size, size);
					let r = 0;
					let g = 0;
					let b = 0;
					let total = 0;
					for (let i = 0; i < data.length; i += 4) {
						const max = Math.max(data[i], data[i + 1], data[i + 2]);
						const min = Math.min(data[i], data[i + 1], data[i + 2]);
						const weight = 0.05 + (max - min) / 255;
						r += data[i] * weight;
						g += data[i + 1] * weight;
						b += data[i + 2] * weight;
						total += weight;
					}
					const k = 0.45; // darken
					resolve(`rgb(${Math.round((r / total) * k)}, ${Math.round((g / total) * k)}, ${Math.round((b / total) * k)})`);
				} catch {
					resolve(null);
				}
			};
			img.onerror = () => resolve(null);
			img.src = url;
		});
	}

	// ------------------------------------------------------------------ lyrics

	async function fetchFromSpotify(uri) {
		const id = uri.split(":")[2];
		const response = await Spicetify.CosmosAsync.get(
			`https://spclient.wg.spotify.com/color-lyrics/v2/track/${id}?format=json&vocalRemoval=false&market=from_token`
		);
		const lyrics = response?.lyrics;
		if (!lyrics?.lines?.length) return null;
		const synced = lyrics.syncType === "LINE_SYNCED";
		return lyrics.lines.map((line) => ({ text: line.words, startTime: synced ? Number(line.startTimeMs) : null }));
	}

	async function fetchFromLrclib(meta) {
		const query = new URLSearchParams({
			track_name: meta.title,
			artist_name: meta.artist_name,
			album_name: meta.album_title,
			duration: String(Number(meta.duration) / 1000),
		});
		const response = await fetch(`https://lrclib.net/api/get?${query}`);
		if (!response.ok) return null;
		const data = await response.json();
		if (data.instrumental) return [{ text: "♪ Instrumental ♪", startTime: null }];
		if (data.syncedLyrics) {
			const parsed = [];
			for (const raw of data.syncedLyrics.split("\n")) {
				const match = raw.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s?(.*)$/);
				if (match) parsed.push({ text: match[3], startTime: (Number(match[1]) * 60 + Number(match[2])) * 1000 });
			}
			if (parsed.length) return parsed;
		}
		if (data.plainLyrics) return data.plainLyrics.split("\n").map((text) => ({ text, startTime: null }));
		return null;
	}

	// ------------------------------------------------------------------ mini player

	let mini = null; // { root, els, ... }

	function toggleMini() {
		if (mini) closeMini();
		else openMini();
	}

	function openMini() {
		if (mini) return;
		if (!styleEl.isConnected) document.head.appendChild(styleEl);

		const els = {};
		els.bg = h("div", { class: "lpm-bg" });
		els.grip = h("div", { class: "lpm-grip" }, "Lyrics Plus");
		els.fullBtn = iconButton("full", "Full screen", () => toggleFullscreen());
		els.pinBtn = iconButton("pin", "Keep on top (open in its own window)", () => (mini?.pip ? unpin() : pin()));
		els.moreBtn = iconButton("more", "Settings", () => toggleMenu());
		els.bar = h("div", { class: "lpm-bar" }, els.grip, els.moreBtn, els.pinBtn, els.fullBtn, iconButton("close", "Close", () => closeMini()));
		els.art = h("img", { class: "lpm-art", alt: "", draggable: "false" });
		els.title = h("div", { class: "lpm-title" });
		els.artist = h("div", { class: "lpm-artist" });
		els.lyrics = h("div", { class: "lpm-lyrics" });
		els.elapsed = h("span", {}, "0:00");
		els.remaining = h("span", {}, "-0:00");
		els.fill = h("div", { class: "lpm-fill" }, h("div", { class: "lpm-knob" }));
		els.track = h("div", { class: "lpm-track", role: "slider", "aria-label": "Seek" }, els.fill);
		els.progress = h("div", { class: "lpm-progress" }, els.elapsed, els.track, els.remaining);
		els.playBtn = iconButton("play", "Play", () => Spicetify.Player.togglePlay(), "lpm-ctl lpm-play");
		els.shuffleBtn = iconButton("shuffle", "Shuffle", () => {
			Spicetify.Player.toggleShuffle();
			setTimeout(paintModes, 150);
		}, "lpm-ctl lpm-small");
		els.repeatBtn = iconButton("repeat", "Repeat", () => {
			Spicetify.Player.toggleRepeat();
			setTimeout(paintModes, 150);
		}, "lpm-ctl lpm-small");
		els.controls = h(
			"div",
			{ class: "lpm-controls" },
			els.shuffleBtn,
			iconButton("prev", "Previous", () => Spicetify.Player.back(), "lpm-ctl"),
			els.playBtn,
			iconButton("next", "Next", () => Spicetify.Player.next(), "lpm-ctl"),
			els.repeatBtn
		);
		els.likeBtn = iconButton("likeOff", "Save to Liked Songs", () => {
			Spicetify.Player.toggleHeart();
			// A little pop, then the real state once Spotify has saved it
			els.likeBtn.classList.remove("lpm-pop");
			void els.likeBtn.offsetWidth;
			els.likeBtn.classList.add("lpm-pop");
			setTimeout(paintModes, 300);
		}, "lpm-like");
		els.muteBtn = iconButton("volume", "Mute", () => {
			// setMute/toggleMute click Spotify's old volume-button selector, which newer clients no longer expose.
			const volume = Spicetify.Player.getVolume();
			if (volume > 0) {
				mini.lastAudibleVolume = volume;
				Spicetify.Player.setVolume(0);
			} else {
				Spicetify.Player.setVolume(mini.lastAudibleVolume ?? 0.5);
			}
			setTimeout(paintModes, 150);
		}, "lpm-ctl lpm-small lpm-mute");
		els.volume = h("input", { type: "range", class: "lpm-volume", min: "0", max: "100", step: "1", "aria-label": "Volume" });
		els.volume.addEventListener("input", () => {
			Spicetify.Player.setVolume(Number(els.volume.value) / 100);
			paintVolume();
		});
		els.volume.addEventListener("pointerdown", () => (mini.draggingVolume = true));
		els.volume.addEventListener("pointerup", () => (mini.draggingVolume = false));
		// Slider then icon: shown icon-first in a row, and as a vertical bar with the icon underneath on portrait screens
		els.volWrap = h("div", { class: "lpm-volwrap" }, els.volume, els.muteBtn);
		els.meta = h("div", { class: "lpm-meta" }, h("div", { class: "lpm-metatext" }, els.title, els.artist), els.likeBtn);
		els.extras = h("div", { class: "lpm-extras" }, els.volWrap);
		// Everything under the song info, kept together so "Show only on hover" can fold it away and give the space to the lyrics
		els.dock = h("div", { class: "lpm-dock" }, els.progress, els.controls, els.extras);
		// In full screen the cover, title, progress and controls stack on the left, lyrics on the right
		els.side = h("div", { class: "lpm-side" }, els.art, els.meta, els.dock);
		els.main = h("div", { class: "lpm-main" }, els.side, els.lyrics);

		const root = h("div", { class: "lpm", role: "dialog", "aria-label": "Mini player" }, els.bg, els.bar, els.main);
		// Progress and controls live inside .lpm-side but are shown full width at the bottom outside full screen
		const pos = store.get("pos", null);
		const size = store.get("size", { w: 360, h: 460 });
		root.style.width = `${Math.max(MIN_W, size.w)}px`;
		root.style.height = `${Math.max(MIN_H, size.h)}px`;
		root.style.left = `${pos ? pos.x : window.innerWidth - Math.max(MIN_W, size.w) - 24}px`;
		root.style.top = `${pos ? pos.y : window.innerHeight - Math.max(MIN_H, size.h) - 110}px`;
		root.style.setProperty("--lpm-font", `${store.get("font", 18)}px`);

		mini = { root, els, lines: [], lineEls: [], activeIndex: -1, loadedUri: null, timer: null, pip: null, menu: null };
		layoutForMode();
		document.body.appendChild(root);
		clampIntoView();

		makeDraggable();
		// Click or drag the song bar. While dragging, the bar and time follow the pointer; the seek happens on release.
		const seekRatio = (e) => {
			const rect = els.track.getBoundingClientRect();
			return Math.min(1, Math.max(0, (e.clientX - rect.left) / Math.max(rect.width, 1)));
		};
		els.track.addEventListener("pointerdown", (e) => {
			if (e.button !== 0) return;
			e.preventDefault();
			try {
				els.track.setPointerCapture(e.pointerId);
			} catch {}
			mini.seeking = seekRatio(e);
			els.track.classList.add("lpm-seeking");
			paintProgress();
		});
		els.track.addEventListener("pointermove", (e) => {
			if (mini?.seeking == null) return;
			mini.seeking = seekRatio(e);
			paintProgress();
		});
		const endSeek = (e, commit) => {
			if (mini?.seeking == null) return;
			const ratio = commit ? seekRatio(e) : null;
			mini.seeking = null;
			els.track.classList.remove("lpm-seeking");
			if (ratio !== null) Spicetify.Player.seek(Math.round(ratio * (Spicetify.Player.getDuration() || 0)));
		};
		els.track.addEventListener("pointerup", (e) => endSeek(e, true));
		els.track.addEventListener("pointercancel", (e) => endSeek(e, false));

		mini.resizeObserver = new ResizeObserver(() => {
			layoutForMode();
			if (!mini.pip && !root.classList.contains("lpm-full")) store.set("size", { w: root.offsetWidth, h: root.offsetHeight });
		});
		mini.resizeObserver.observe(root);

		Spicetify.Player.addEventListener("songchange", onSong);
		Spicetify.Player.addEventListener("onplaypause", paintPlayState);
		mini.timer = setInterval(tick, 250);
		onSong();
		paintPlayState();
	}

	function closeMini() {
		if (!mini) return;
		openedForFullscreen = false;
		if (mini.root.classList.contains("lpm-full")) exitFullscreen();
		const pip = mini.pip;
		mini.pip = null;
		pip?.close();
		clearInterval(mini.timer);
		mini.resizeObserver?.disconnect();
		Spicetify.Player.removeEventListener("songchange", onSong);
		Spicetify.Player.removeEventListener("onplaypause", paintPlayState);
		mini.root.remove();
		mini = null;
	}

	// Pick Compact, Expanded or Lyrics from the player's own size, like a desktop mini player
	function layoutForMode() {
		if (!mini) return;
		const { root, els } = mini;
		const w = root.clientWidth;
		const hgt = root.clientHeight;
		const full = root.classList.contains("lpm-full");
		let mode = "lyrics";
		// Full screen has its own two layouts, so the mini player's size-based ones never apply to it
		if (full) mode = hgt > w ? "portrait" : "landscape";
		else if (hgt < 230) mode = "compact";
		else if (hgt / Math.max(w, 1) < 1.2) mode = "expanded";
		root.dataset.mode = mode;
		// Outside full screen the progress bar and controls sit full width under everything else
		if (full) {
			if (els.dock.parentElement !== els.side) els.side.append(els.dock);
		} else if (els.dock.parentElement !== root) {
			root.append(els.dock);
		}
		root.classList.toggle("lpm-hover-controls", store.get("hoverControls", false));
	}

	function clampIntoView() {
		if (!mini || mini.pip) return;
		const { root } = mini;
		const x = Math.min(Math.max(0, root.offsetLeft), Math.max(0, window.innerWidth - root.offsetWidth));
		const y = Math.min(Math.max(0, root.offsetTop), Math.max(0, window.innerHeight - root.offsetHeight));
		root.style.left = `${x}px`;
		root.style.top = `${y}px`;
	}

	function makeDraggable() {
		const { root, els } = mini;
		els.bar.addEventListener("pointerdown", (e) => {
			if (root.classList.contains("lpm-full") || e.target.closest("button")) return;
			if (mini?.pip) return dragPinnedWindow(e);
			const startX = e.clientX - root.offsetLeft;
			const startY = e.clientY - root.offsetTop;
			els.bar.setPointerCapture(e.pointerId);
			const move = (ev) => {
				root.style.left = `${ev.clientX - startX}px`;
				root.style.top = `${ev.clientY - startY}px`;
				clampIntoView();
			};
			const up = () => {
				els.bar.removeEventListener("pointermove", move);
				els.bar.removeEventListener("pointerup", up);
				store.set("pos", { x: root.offsetLeft, y: root.offsetTop });
			};
			els.bar.addEventListener("pointermove", move);
			els.bar.addEventListener("pointerup", up);
		});
	}
	window.addEventListener("resize", clampIntoView);

	// The pinned window has no title bar of its own, so its top bar moves the whole window (as Spotify's own mini player does)
	function dragPinnedWindow(e) {
		const pip = mini.pip;
		const bar = mini.els.bar;
		const offsetX = e.screenX - pip.screenX;
		const offsetY = e.screenY - pip.screenY;
		bar.setPointerCapture(e.pointerId);
		const move = (ev) => {
			try {
				pip.moveTo(ev.screenX - offsetX, ev.screenY - offsetY);
			} catch {
				// moving isn't allowed here; nothing else to do
			}
		};
		const up = () => {
			bar.removeEventListener("pointermove", move);
			bar.removeEventListener("pointerup", up);
			store.set("pipCorner", "custom");
			store.set("pipPos", { x: pip.screenX, y: pip.screenY });
		};
		bar.addEventListener("pointermove", move);
		bar.addEventListener("pointerup", up);
	}

	function placePinnedWindow() {
		const pip = mini?.pip;
		if (!pip) return;
		const corner = store.get("pipCorner", "bottom-right");
		const margin = 16;
		const sx = screen.availLeft ?? 0;
		const sy = screen.availTop ?? 0;
		let x;
		let y;
		if (corner === "custom") {
			const pos = store.get("pipPos", null);
			if (!pos) return;
			({ x, y } = pos);
		} else {
			x = corner.endsWith("left") ? sx + margin : sx + screen.availWidth - pip.outerWidth - margin;
			y = corner.startsWith("top") ? sy + margin : sy + screen.availHeight - pip.outerHeight - margin;
		}
		try {
			pip.moveTo(x, y);
		} catch {
			// the window stays where the system put it
		}
	}

	// ------------------------------------------------------------- settings menu

	const BACKGROUNDS = [
		{ id: "dynamic", label: "Dynamic color" },
		{ id: "cover", label: "Album cover" },
		{ id: "static", label: "Static color" },
	];

	function toggleMenu() {
		if (!mini) return;
		if (mini.menu) {
			mini.menu.remove();
			mini.menu = null;
			return;
		}
		const current = store.get("background", "dynamic");
		const pick = (id) => {
			store.set("background", id);
			paintBackground();
			toggleMenu();
		};
		const font = (dir) => {
			const next = Math.max(FONT_LIMIT.min, Math.min(FONT_LIMIT.max, store.get("font", 18) + dir * FONT_LIMIT.step));
			store.set("font", next);
			mini.root.style.setProperty("--lpm-font", `${next}px`);
		};
		const script = store.get("script", "original");
		const pickScript = (id) => {
			store.set("script", id);
			toggleMenu();
			renderLyrics();
		};
		const corner = store.get("pipCorner", "bottom-right");
		const pickCorner = (id) => {
			store.set("pipCorner", id);
			toggleMenu();
			placePinnedWindow();
		};
		const CORNERS = [
			["top-left", "Top left"],
			["top-right", "Top right"],
			["bottom-left", "Bottom left"],
			["bottom-right", "Bottom right"],
		];
		mini.menu = h(
			"div",
			{ class: "lpm-menu", role: "menu" },
			h("h4", {}, "Lyrics"),
			SCRIPTS.map(([id, label]) => h("button", { type: "button", class: id === script ? "lpm-on" : "", onclick: () => pickScript(id) }, label)),
			h("div", { class: "lpm-row" }, h("button", { type: "button", title: "Smaller lyrics", onclick: () => font(-1) }, "A−"), h("button", { type: "button", title: "Larger lyrics", onclick: () => font(1) }, "A+")),
			h("h4", {}, "Controls"),
			h(
				"button",
				{
					type: "button",
					class: store.get("hoverControls", false) ? "lpm-on" : "",
					onclick: () => {
						store.set("hoverControls", !store.get("hoverControls", false));
						toggleMenu();
						layoutForMode();
					},
				},
				"Show only on hover"
			),
			h("h4", {}, "Background"),
			BACKGROUNDS.map((b) => h("button", { type: "button", class: b.id === current ? "lpm-on" : "", onclick: () => pick(b.id) }, b.label)),
			h("h4", {}, "Kept-on-top window"),
			h("div", { class: "lpm-grid" }, CORNERS.map(([id, label]) => h("button", { type: "button", class: id === corner ? "lpm-on" : "", onclick: () => pickCorner(id) }, label))),
			h("h4", {}, "More"),
			h("button", { type: "button", onclick: () => { toggleMenu(); if (mini?.pip) unpin(); Spicetify.Platform.History.push(LYRICS_PATH); } }, "Open full lyrics page")
		);
		mini.root.appendChild(mini.menu);
	}

	async function paintBackground() {
		if (!mini) return;
		const { els } = mini;
		const mode = store.get("background", "dynamic");
		const url = els.art.getAttribute("src");
		els.bg.replaceChildren();
		if (mode === "cover" && url) {
			els.bg.append(h("img", { src: url, alt: "" }));
			mini.root.style.setProperty("--lpm-color", "#121212");
		} else if (mode === "dynamic") {
			const color = await coverColor(url);
			if (mini && els.art.getAttribute("src") === url) mini.root.style.setProperty("--lpm-color", color ?? "#282828");
		} else {
			mini.root.style.setProperty("--lpm-color", "var(--spice-card, #282828)");
		}
	}

	// ------------------------------------------------------------- song + lyrics

	async function onSong() {
		if (!mini) return;
		const { els } = mini;
		const item = Spicetify.Player.data?.item;
		const meta = item?.metadata;
		if (!item?.uri || !meta) {
			els.title.textContent = "Nothing playing";
			els.artist.textContent = "";
			els.grip.textContent = "Lyrics Plus";
			showMessage("Play something to see lyrics");
			return;
		}
		els.title.textContent = meta.title ?? "";
		els.artist.textContent = meta.artist_name ?? "";
		els.grip.textContent = `${meta.title ?? ""} · ${meta.artist_name ?? ""}`;
		const cover = coverUrl(meta);
		if (els.art.getAttribute("src") !== cover) els.art.setAttribute("src", cover);
		if (mini.pip) mini.pip.document.title = `${meta.title} · ${meta.artist_name}`;
		paintBackground();

		if (item.uri === mini.loadedUri) return;
		mini.loadedUri = item.uri;
		showMessage("Loading lyrics…");
		let result = null;
		for (const source of [() => fetchFromSpotify(item.uri), () => fetchFromLrclib(meta)]) {
			try {
				result = await source();
			} catch (error) {
				console.warn("[Lyrics Plus] mini player lyrics source failed", error);
			}
			if (result) break;
		}
		if (!mini || mini.loadedUri !== item.uri) return;
		mini.root.classList.toggle("lpm-nolyrics", !result);
		if (!result) {
			showMessage("No lyrics for this song");
			return;
		}
		mini.lines = result;
		renderLyrics();
	}

	// Draw the lyrics in the chosen script: as written, romanized, or both (romanized under the original)
	async function renderLyrics() {
		if (!mini || !mini.lines.length) return;
		const { els } = mini;
		const lines = mini.lines;
		const script = store.get("script", "original");
		let roman = null;
		if (script !== "original") {
			try {
				roman = await romanizeLines(lines.map((l) => l.text ?? ""));
			} catch (error) {
				console.warn("[Lyrics Plus] romanization failed", error);
			}
			if (!mini || mini.lines !== lines) return; // the song changed meanwhile
		}
		mini.activeIndex = -1;
		const synced = lines.some((l) => l.startTime !== null);
		els.lyrics.classList.toggle("lpm-static", !synced);
		els.lyrics.replaceChildren();
		mini.lineEls = lines.map((line, i) => {
			const romanText = roman?.[i] && roman[i] !== line.text ? roman[i] : null;
			const onlyRoman = script === "romanized" && romanText;
			const el = h(
				"p",
				{ class: `lpm-line${line.startTime !== null ? " lpm-synced" : ""}${onlyRoman ? " lpm-romanonly" : ""}` },
				onlyRoman ? null : line.text || "♪",
				romanText ? h("span", { class: "lpm-roman" }, romanText) : null
			);
			if (line.startTime !== null) el.addEventListener("click", () => Spicetify.Player.seek(line.startTime));
			els.lyrics.appendChild(el);
			return el;
		});
		els.lyrics.scrollTop = 0;
		tick();
	}

	// ------------------------------------------------------------- romanization
	// The same libraries the full Lyrics Plus page uses, loaded only when a song needs them.

	const SCRIPTS = [
		["original", "As written"],
		["romanized", "Romanized"],
		["both", "Both"],
	];
	const LIBS = {
		kuroshiro: "https://cdn.jsdelivr.net/npm/kuroshiro@1.2.0/dist/kuroshiro.min.js",
		kuromoji: "https://cdn.jsdelivr.net/npm/kuroshiro-analyzer-kuromoji@1.1.0/dist/kuroshiro-analyzer-kuromoji.min.js",
		aromanize: "https://cdn.jsdelivr.net/npm/aromanize@0.1.5/aromanize.min.js",
		pinyin: "https://cdn.jsdelivr.net/npm/pinyin-pro@3.28.1/dist/index.min.js",
	};
	// kuromoji joins paths in a way that turns "https://" into "https:/"; the full page applies the same fix
	const DICT_PATH = "https:/cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict";

	// Callers check the library's global first, so an existing tag here means it is still loading
	function loadScript(url) {
		return new Promise((resolve, reject) => {
			const existing = document.querySelector(`script[src="${url}"]`);
			const script = existing ?? document.createElement("script");
			script.addEventListener("load", () => resolve());
			script.addEventListener("error", reject);
			if (!existing) {
				script.src = url;
				document.head.appendChild(script);
			}
		});
	}

	let kuroshiro = null;
	async function japanese() {
		if (kuroshiro) return kuroshiro;
		if (typeof XMLHttpRequest.prototype.realOpen === "undefined") {
			XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function (method, url, bool) {
				if (url.indexOf(DICT_PATH) === 0) this.realOpen(method, url.replace("https:/", "https://"), bool);
				else this.realOpen(method, url, bool);
			};
		}
		if (typeof window.Kuroshiro === "undefined") await loadScript(LIBS.kuroshiro);
		if (typeof window.KuromojiAnalyzer === "undefined") await loadScript(LIBS.kuromoji);
		const instance = new window.Kuroshiro.default();
		await instance.init(new window.KuromojiAnalyzer({ dictPath: DICT_PATH }));
		kuroshiro = instance;
		return kuroshiro;
	}

	const HAS_KANA = /[぀-ヿ]/;
	const HAS_HAN = /[一-鿿]/;
	const HAS_HANGUL = /[가-힯]/;

	async function romanizeLines(texts) {
		const all = texts.join("\n");
		// Kana means Japanese (kanji included); Han characters without kana mean Chinese
		if (HAS_KANA.test(all)) {
			const k = await japanese();
			return Promise.all(texts.map((t) => (HAS_KANA.test(t) || HAS_HAN.test(t) ? k.convert(t, { to: "romaji", mode: "spaced" }) : t)));
		}
		if (HAS_HANGUL.test(all)) {
			if (typeof window.Aromanize === "undefined") await loadScript(LIBS.aromanize);
			return texts.map((t) => (HAS_HANGUL.test(t) ? window.Aromanize.hangulToLatin(t, "rr-translit") : t));
		}
		if (HAS_HAN.test(all)) {
			if (typeof window.pinyinPro === "undefined") await loadScript(LIBS.pinyin);
			return texts.map((t) => (HAS_HAN.test(t) ? window.pinyinPro.pinyin(t, { toneType: "symbol", nonZh: "consecutive" }) : t));
		}
		return texts; // already in Latin script
	}

	function showMessage(text) {
		if (!mini) return;
		mini.lines = [];
		mini.lineEls = [];
		mini.activeIndex = -1;
		mini.els.lyrics.classList.remove("lpm-static");
		mini.els.lyrics.replaceChildren(h("div", { class: "lpm-message" }, text));
	}

	function paintPlayState() {
		if (!mini) return;
		const playing = Spicetify.Player.isPlaying();
		mini.els.playBtn.innerHTML = playing ? ICONS.pause : ICONS.play;
		mini.els.playBtn.title = playing ? "Pause" : "Play";
	}

	// Shuffle, repeat and like can change from anywhere in Spotify, so they're re-read on every tick
	function paintModes() {
		if (!mini) return;
		const { els } = mini;
		const shuffle = !!Spicetify.Player.getShuffle?.();
		els.shuffleBtn.classList.toggle("lpm-on", shuffle);
		els.shuffleBtn.title = shuffle ? "Shuffle: on" : "Shuffle: off";
		const repeat = Spicetify.Player.getRepeat?.() ?? 0; // 0 off, 1 all, 2 one song
		els.repeatBtn.classList.toggle("lpm-on", repeat > 0);
		const repeatIcon = repeat === 2 ? ICONS.repeatOne : ICONS.repeat;
		if (els.repeatBtn.dataset.icon !== repeatIcon) {
			els.repeatBtn.innerHTML = repeatIcon;
			els.repeatBtn.dataset.icon = repeatIcon;
		}
		els.repeatBtn.title = ["Repeat: off", "Repeat: all", "Repeat: this song"][repeat] ?? "Repeat";
		const liked = !!Spicetify.Player.getHeart?.();
		els.likeBtn.classList.toggle("lpm-on", liked);
		const likeIcon = liked ? ICONS.likeOn : ICONS.likeOff;
		if (els.likeBtn.dataset.icon !== likeIcon) {
			els.likeBtn.innerHTML = likeIcon;
			els.likeBtn.dataset.icon = likeIcon;
		}
		els.likeBtn.title = liked ? "Remove from Liked Songs" : "Save to Liked Songs";
		paintVolume();
	}

	function paintVolume() {
		if (!mini) return;
		const { els } = mini;
		const muted = !!Spicetify.Player.getMute?.();
		const volume = Math.round((Spicetify.Player.getVolume?.() ?? 0) * 100);
		if (!mini.draggingVolume) els.volume.value = String(muted ? 0 : volume);
		els.volume.style.setProperty("--lpm-vol", `${muted ? 0 : volume}%`);
		const icon = muted || volume === 0 ? ICONS.muted : ICONS.volume;
		if (els.muteBtn.dataset.icon !== icon) {
			els.muteBtn.innerHTML = icon;
			els.muteBtn.dataset.icon = icon;
		}
		if (!muted && volume > 0) mini.lastAudibleVolume = volume / 100;
		const silent = muted || volume === 0;
		els.muteBtn.title = silent ? "Unmute" : "Mute";
		els.muteBtn.setAttribute("aria-label", els.muteBtn.title);
		els.muteBtn.setAttribute("aria-pressed", String(silent));
	}

	// Song bar and times. While the ball is being dragged they show the drag position; returns the real position.
	function paintProgress() {
		const { els } = mini;
		const progress = Spicetify.Player.getProgress() || 0;
		const duration = Spicetify.Player.getDuration() || 0;
		const shown = mini.seeking != null ? mini.seeking * duration : progress;
		els.elapsed.textContent = fmt(shown);
		els.remaining.textContent = `-${fmt(duration - shown)}`;
		els.fill.style.width = `${duration ? Math.min(100, (shown / duration) * 100) : 0}%`;
		return progress;
	}

	function tick() {
		if (!mini) return;
		const { els } = mini;
		const progress = paintProgress();
		paintModes();

		if (!mini.lines.length || mini.lines[0].startTime === null) return;
		let index = -1;
		for (let i = 0; i < mini.lines.length; i++) {
			if (mini.lines[i].startTime <= progress) index = i;
			else break;
		}
		if (index === mini.activeIndex) return;
		mini.lineEls[mini.activeIndex]?.classList.remove("lpm-active");
		mini.activeIndex = index;
		const el = mini.lineEls[index];
		if (!el) return;
		el.classList.add("lpm-active");
		// Keep the current line in view unless the pointer is over the lyrics (the user is reading or scrolling)
		if (!els.lyrics.matches(":hover")) {
			els.lyrics.scrollTo({ top: el.offsetTop - els.lyrics.offsetTop - els.lyrics.clientHeight * 0.35, behavior: "smooth" });
		}
	}

	// ------------------------------------------------------------- keep on top
	// Uses the same always-on-top window Spotify's own mini player uses (Document Picture-in-Picture).

	async function pin() {
		if (!mini || mini.pip) return;
		if (!window.documentPictureInPicture?.requestWindow) {
			Spicetify.showNotification?.("Keeping on top isn't supported in this version of Spotify", true);
			return;
		}
		if (mini.root.classList.contains("lpm-full")) exitFullscreen();
		try {
			const pip = await window.documentPictureInPicture.requestWindow({ width: mini.root.offsetWidth, height: mini.root.offsetHeight });
			// Copy Spotify's fonts and colours, then this player's own styles, into the new window
			for (const node of document.head.querySelectorAll('link[rel="stylesheet"], style')) pip.document.head.appendChild(node.cloneNode(true));
			pip.document.documentElement.className = document.documentElement.className;
			pip.document.documentElement.setAttribute("style", document.documentElement.getAttribute("style") ?? "");
			pip.document.body.style.cssText = "margin:0;overflow:hidden;background:#121212;";
			mini.pip = pip;
			mini.menu?.remove();
			mini.menu = null;
			mini.root.classList.add("lpm-pinned");
			mini.els.pinBtn.classList.add("lpm-on");
			mini.els.pinBtn.title = "Put back into Spotify";
			mini.els.fullBtn.style.display = "none";
			pip.document.body.appendChild(mini.root);
			pip.document.title = mini.els.grip.textContent;
			// Resizing the pinned window switches between Compact, Expanded and Lyrics
			pip.addEventListener("resize", layoutForMode);
			placePinnedWindow();
			pip.document.addEventListener("pointerdown", (e) => {
				if (mini?.menu && !mini.menu.contains(e.target) && !mini.els.moreBtn.contains(e.target)) toggleMenu();
			});
			layoutForMode();
			pip.addEventListener("pagehide", () => {
				if (mini?.pip === pip) unpin(true);
			});
		} catch (error) {
			console.warn("[Lyrics Plus] could not open the always-on-top window", error);
			Spicetify.showNotification?.("Couldn't open the always-on-top window", true);
		}
	}

	function unpin(windowClosed = false) {
		if (!mini?.pip) return;
		const pip = mini.pip;
		mini.pip = null;
		mini.root.classList.remove("lpm-pinned");
		mini.els.pinBtn.classList.remove("lpm-on");
		mini.els.pinBtn.title = "Keep on top (open in its own window)";
		mini.els.fullBtn.style.display = "";
		document.body.appendChild(mini.root);
		clampIntoView();
		if (!windowClosed) pip.close();
	}

	// ------------------------------------------------------------- full screen

	async function toggleFullscreen() {
		if (!mini) return;
		if (mini.root.classList.contains("lpm-full")) exitFullscreen();
		else enterFullscreen();
	}

	async function enterFullscreen() {
		if (!mini || mini.pip) return;
		mini.menu?.remove();
		mini.menu = null;
		mini.root.classList.add("lpm-full");
		mini.els.fullBtn.innerHTML = ICONS.exitFull;
		mini.els.fullBtn.title = "Exit full screen";
		layoutForMode();
		try {
			if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
		} catch {
			// Spotify may refuse true full screen; the player still fills the window
		}
	}

	// Full screen started from Spotify's own full screen button, or the lyrics page, opens the player just for
	// that; leaving full screen then closes it again instead of leaving a mini player behind
	let openedForFullscreen = false;
	function openFullscreen() {
		if (!mini) {
			openMini();
			openedForFullscreen = true;
		}
		if (mini.pip) unpin();
		enterFullscreen();
	}

	function exitFullscreen() {
		if (!mini) return;
		if (openedForFullscreen) {
			openedForFullscreen = false;
			if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
			closeMini();
			return;
		}
		mini.root.classList.remove("lpm-full");
		mini.els.fullBtn.innerHTML = ICONS.full;
		mini.els.fullBtn.title = "Full screen";
		layoutForMode();
		clampIntoView();
		if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
	}

	document.addEventListener("fullscreenchange", () => {
		if (!document.fullscreenElement && mini?.root.classList.contains("lpm-full")) exitFullscreen();
	});
	document.addEventListener(
		"keydown",
		(e) => {
			if (e.key === "Escape" && mini?.root.classList.contains("lpm-full")) exitFullscreen();
		},
		true
	);
	document.addEventListener("pointerdown", (e) => {
		if (mini?.menu && !mini.menu.contains(e.target) && !mini.els.moreBtn.contains(e.target)) toggleMenu();
	});

	// Spotify's own full screen button (bottom right) opens this full screen view instead of Spotify's,
	// while the player bar button is on. Captured before Spotify handles the click.
	document.addEventListener(
		"click",
		(e) => {
			if (!hideNavIcon || !(e.target instanceof Element)) return;
			if (!e.target.closest('[data-testid="fullscreen-mode-button"]')) return;
			e.preventDefault();
			e.stopPropagation();
			if (mini?.root.classList.contains("lpm-full")) exitFullscreen();
			else openFullscreen();
		},
		true
	);
	// The full lyrics page's own full screen key asks for this view too
	window.addEventListener("lyrics-plus-mini", (e) => {
		if (e.detail === "fullscreen") {
			if (mini?.root.classList.contains("lpm-full")) exitFullscreen();
			else openFullscreen();
		} else if (e.detail === "toggle") {
			toggleMini();
		}
	});
})();
