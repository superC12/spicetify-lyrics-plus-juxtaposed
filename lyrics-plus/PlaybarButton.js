(function PlaybarButton() {
	if (!Spicetify.Platform.History || !Spicetify.Player || !Spicetify.Playbar) {
		setTimeout(PlaybarButton, 300);
		return;
	}

	const LYRICS_PATH = "/lyrics-plus";
	const FONT_KEY = "lyrics-plus:popup:font-size";
	const FONT_LIMIT = { min: 12, max: 32, step: 2 };

	const button = new Spicetify.Playbar.Button(
		"Lyrics Plus",
		`<svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon" fill="currentColor"><path d="M13.426 2.574a2.831 2.831 0 0 0-4.797 1.55l3.247 3.247a2.831 2.831 0 0 0 1.55-4.797zM10.5 8.118l-2.619-2.62A63303.13 63303.13 0 0 0 4.74 9.075L2.065 12.12a1.287 1.287 0 0 0 1.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 1 1 4.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 0 1-3.933-3.933l2.676-3.045 3.505-3.99z"></path></svg>`,
		() => {
			// On the full lyrics page the button takes you back; anywhere else it toggles the pop-up
			if (Spicetify.Platform.History.location.pathname === LYRICS_PATH) Spicetify.Platform.History.goBack();
			else togglePopup();
		},
		false,
		Spicetify.Platform.History.location.pathname === LYRICS_PATH,
		false
	);

	const style = document.createElement("style");
	style.innerHTML = `
		[data-testid="lyrics-button"] {
			display: none !important;
		}
		li[data-id="/lyrics-plus"] {
			display: none;
		}
		.lyrics-popup {
			position: fixed;
			right: 24px;
			bottom: 116px;
			z-index: 100;
			display: flex;
			flex-direction: column;
			width: 380px;
			height: min(480px, calc(100vh - 220px));
			border-radius: 12px;
			background: var(--spice-card);
			color: var(--spice-text);
			box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
			overflow: hidden;
		}
		.lyrics-popup-header {
			display: flex;
			align-items: center;
			gap: 4px;
			padding: 10px 12px 10px 16px;
			border-bottom: 1px solid rgba(var(--spice-rgb-text), 0.1);
		}
		.lyrics-popup-heading {
			flex: 1;
			min-width: 0;
			overflow: hidden;
			font-size: 14px;
			font-weight: 700;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.lyrics-popup-header button {
			min-width: 28px;
			height: 28px;
			padding: 0 6px;
			border: 0;
			border-radius: 6px;
			background: transparent;
			color: var(--spice-subtext);
			font-size: 12px;
			font-weight: 700;
			cursor: pointer;
		}
		.lyrics-popup-header button:hover {
			background: rgba(var(--spice-rgb-text), 0.1);
			color: var(--spice-text);
		}
		.lyrics-popup-body {
			flex: 1;
			overflow-y: auto;
			padding: 16px;
			font-size: var(--lyrics-popup-font-size, 16px);
			font-weight: 700;
			line-height: 1.35;
		}
		.lyrics-popup-line {
			margin: 0 0 0.7em;
			color: var(--spice-subtext);
			opacity: 0.65;
			transition: color 0.2s, opacity 0.2s;
		}
		.lyrics-popup-line.synced {
			cursor: pointer;
		}
		.lyrics-popup-line.synced:hover,
		.lyrics-popup-line.active,
		.lyrics-popup-body.static .lyrics-popup-line {
			color: var(--spice-text);
			opacity: 1;
		}
		.lyrics-popup-message {
			margin-top: 30%;
			color: var(--spice-subtext);
			font-weight: 400;
			text-align: center;
		}
	`;
	style.classList.add("lyrics-plus:visual:playbar-button");

	// On by default; only an explicit "false" turns it off
	if (Spicetify.LocalStorage.get("lyrics-plus:visual:playbar-button") !== "false") setPlaybarButton();
	window.addEventListener("lyrics-plus", (event) => {
		if (event.detail?.name === "playbar-button") event.detail.value ? setPlaybarButton() : removePlaybarButton();
	});

	Spicetify.Platform.History.listen((location) => {
		const onLyricsPage = location.pathname === LYRICS_PATH;
		if (onLyricsPage) closePopup();
		button.active = onLyricsPage || !!popup;
	});

	function setPlaybarButton() {
		document.head.appendChild(style);
		button.register();
	}

	function removePlaybarButton() {
		closePopup();
		style.remove();
		button.deregister();
	}

	// ---- Lyrics pop-up: a small window above the player bar, so lyrics don't need a full page ----

	let popup = null;
	let body = null;
	let heading = null;
	let lines = [];
	let lineElements = [];
	let activeIndex = -1;
	let timer = null;
	let loadedUri = null;

	function togglePopup() {
		if (popup) closePopup();
		else openPopup();
	}

	function headerButton(label, title, onClick) {
		const el = document.createElement("button");
		el.type = "button";
		el.textContent = label;
		el.title = title;
		el.addEventListener("click", onClick);
		return el;
	}

	function stepFont(dir) {
		const current = Number(localStorage.getItem(FONT_KEY)) || 16;
		const next = Math.max(FONT_LIMIT.min, Math.min(FONT_LIMIT.max, current + dir * FONT_LIMIT.step));
		localStorage.setItem(FONT_KEY, String(next));
		popup?.style.setProperty("--lyrics-popup-font-size", `${next}px`);
	}

	function openPopup() {
		popup = document.createElement("div");
		popup.className = "lyrics-popup";
		popup.style.setProperty("--lyrics-popup-font-size", `${Number(localStorage.getItem(FONT_KEY)) || 16}px`);

		const header = document.createElement("div");
		header.className = "lyrics-popup-header";
		heading = document.createElement("div");
		heading.className = "lyrics-popup-heading";
		header.append(
			heading,
			headerButton("A−", "Smaller text", () => stepFont(-1)),
			headerButton("A+", "Larger text", () => stepFont(1)),
			headerButton("⤢", "Open full lyrics page", () => {
				closePopup();
				Spicetify.Platform.History.push(LYRICS_PATH);
			}),
			headerButton("✕", "Close", closePopup)
		);

		body = document.createElement("div");
		body.className = "lyrics-popup-body";
		popup.append(header, body);
		document.body.appendChild(popup);

		button.active = true;
		Spicetify.Player.addEventListener("songchange", loadLyrics);
		timer = setInterval(syncActiveLine, 250);
		loadLyrics();
	}

	function closePopup() {
		if (!popup) return;
		clearInterval(timer);
		Spicetify.Player.removeEventListener("songchange", loadLyrics);
		popup.remove();
		popup = body = heading = null;
		lines = [];
		lineElements = [];
		activeIndex = -1;
		loadedUri = null;
		button.active = Spicetify.Platform.History.location.pathname === LYRICS_PATH;
	}

	function showMessage(text) {
		lines = [];
		lineElements = [];
		activeIndex = -1;
		body.classList.remove("static");
		body.replaceChildren();
		const message = document.createElement("div");
		message.className = "lyrics-popup-message";
		message.textContent = text;
		body.appendChild(message);
	}

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

	async function loadLyrics() {
		if (!popup) return;
		const item = Spicetify.Player.data?.item;
		const meta = item?.metadata;
		if (!item?.uri || !meta) {
			heading.textContent = "Lyrics";
			showMessage("Nothing is playing");
			return;
		}
		if (item.uri === loadedUri) return;
		loadedUri = item.uri;
		heading.textContent = `${meta.title} · ${meta.artist_name}`;
		showMessage("Loading lyrics…");

		let result = null;
		for (const source of [() => fetchFromSpotify(item.uri), () => fetchFromLrclib(meta)]) {
			try {
				result = await source();
			} catch (error) {
				console.warn("[Lyrics Plus] pop-up lyrics source failed", error);
			}
			if (result) break;
		}
		// The song may have changed, or the pop-up closed, while this was loading
		if (!popup || loadedUri !== item.uri) return;
		if (!result) {
			showMessage("No lyrics found for this song");
			return;
		}

		lines = result;
		activeIndex = -1;
		const isSynced = lines.some((line) => line.startTime !== null);
		body.classList.toggle("static", !isSynced);
		body.replaceChildren();
		lineElements = lines.map((line) => {
			const el = document.createElement("p");
			el.className = "lyrics-popup-line";
			el.textContent = line.text || "♪";
			if (line.startTime !== null) {
				el.classList.add("synced");
				el.addEventListener("click", () => Spicetify.Player.seek(line.startTime));
			}
			body.appendChild(el);
			return el;
		});
		body.scrollTop = 0;
		syncActiveLine();
	}

	function syncActiveLine() {
		if (!popup || !lines.length || lines[0].startTime === null) return;
		const progress = Spicetify.Player.getProgress();
		let index = -1;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startTime <= progress) index = i;
			else break;
		}
		if (index === activeIndex) return;
		lineElements[activeIndex]?.classList.remove("active");
		activeIndex = index;
		const el = lineElements[index];
		if (!el) return;
		el.classList.add("active");
		// Keep the current line centred unless the pointer is over the list (the user is reading or scrolling)
		if (!body.matches(":hover")) {
			body.scrollTo({ top: el.offsetTop - body.offsetTop - body.clientHeight / 2 + el.clientHeight / 2, behavior: "smooth" });
		}
	}
})();
