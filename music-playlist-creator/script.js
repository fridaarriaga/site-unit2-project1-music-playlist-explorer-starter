const modalOverlay = document.getElementById("modal-overlay");
const playlistModal = document.getElementById("playlist-modal");
const closeModalButton = document.getElementById("close-modal");
const playlistGrid = document.getElementById("playlist-grid");
const modalContent = document.getElementById("modal-content");
const shuffleButton = document.getElementById("shuffle-songs");
const getDescriptionButton = document.getElementById("get-description-btn");
const playlistDescription = document.getElementById("playlist-description");
const navLinks = document.querySelectorAll(".nav-link");
const allPlaylistsView = document.getElementById("all-playlists-view");
const featuredView = document.getElementById("featured-view");
const featuredCover = document.getElementById("featured-cover");
const featuredName = document.getElementById("featured-name");
const featuredAuthor = document.getElementById("featured-author");
const featuredSongList = document.getElementById("featured-song-list");

let playlistsData = [];
let currentModalPlaylist = null;
let featuredPlaylist = null;
const DESCRIPTION_FALLBACK_MESSAGE =
    "I'm sorry, I couldn't generate a proper description at this time. Try again later.";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODELS = ["openrouter/free"];
const OPENROUTER_MAX_RETRIES_PER_MODEL = 3;

function delay(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}


function openModal() {
    modalOverlay.hidden = false;
}

function closeModal() {
    modalOverlay.hidden = true;
}

function pickRandomFeaturedPlaylist(playlists) {
    if (!Array.isArray(playlists) || playlists.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * playlists.length);
    return playlists[randomIndex];
}

function renderFeaturedPlaylist(playlist) {
    if (!playlist) {
        featuredCover.src = "./assets/img/playlist.png";
        featuredCover.alt = "No featured playlist available";
        featuredName.textContent = "No featured playlist found";
        featuredAuthor.textContent = "";
        featuredSongList.innerHTML = "<li class='featured-song-row'>No songs available</li>";
        return;
    }

    featuredCover.src = playlist.Cover;
    featuredCover.alt = `Cover art for ${playlist.Title}`;
    featuredName.textContent = playlist.Title;
    featuredAuthor.textContent = playlist.Creator;

    featuredSongList.innerHTML = playlist.songs
        .map(
            (song) => `
                <li class="featured-song-row">
                    <div>
                        <strong>${song.title}</strong>
                        <p>${song.artist}</p>
                    </div>
                    <span>${song.duration}</span>
                </li>
            `
        )
        .join("");
}

function setActiveView(view) {
    const isFeatured = view === "featured";
    allPlaylistsView.hidden = isFeatured;
    featuredView.hidden = !isFeatured;

    navLinks.forEach((link) => {
        const isActive = link.dataset.view === view;
        link.classList.toggle("is-active", isActive);
    });
}

function shuffleSongs(songs) {
    const shuffled = [...songs];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function populateModalContent(playlist) {
    if (!playlist.originalSongs) {
        playlist.originalSongs = playlist.songs.map((song) => ({ ...song }));
    }

    const songsMarkup = playlist.songs
        .map(
            (song) => `
                <li class="modal-song-row">
                    <img class="modal-song-cover" src="${song.coverImage}" alt="Album art for ${song.title}">
                    <div class="modal-song-meta">
                        <p class="modal-song-title">${song.title}</p>
                        <p class="modal-song-artist">${song.artist}</p>
                        <p class="modal-song-album">${song.album}</p>
                    </div>
                    <p class="modal-song-duration">${song.duration}</p>
                </li>
            `
        )
        .join("");

    modalContent.innerHTML = `
        <article class="modal-playlist-details">
            <img class="modal-playlist-cover" src="${playlist.Cover}" alt="Cover art for ${playlist.Title}">
            <div class="modal-playlist-meta">
                <h3 class="modal-playlist-title">${playlist.Title}</h3>
                <p class="modal-playlist-author">${playlist.Creator}</p>
            </div>
        </article>
        <ul class="modal-song-list" aria-label="Songs in selected playlist">
            ${songsMarkup}
        </ul>
    `;

    playlistDescription.textContent = "";
}

function buildDescriptionPrompt(playlist) {
    const songList = playlist.songs.map((song) => `${song.title} by ${song.artist}`).join(", ");

    return `
You are a music guide writing a quick recommendation blurb.
Write exactly 2-3 complete sentences that describe the playlist's overall mood, vibe, and best listening context for someone choosing music fast.
Use a casual but polished tone.

Playlist info:
- Playlist name: ${playlist.Title}
- Author: ${playlist.Creator}
- Songs: ${songList}

Constraints:
- Do not ask questions.
- Do not list songs one by one.
- Do not use generic marketing language.
- Do not repeat the playlist title verbatim.
- Output only the final description text.
`.trim();
}

async function getPlaylistDescription(playlist) {
    try {
        const apiKey = String(window.OPENROUTER_API_KEY || "").trim();
        if (!apiKey) {
            return DESCRIPTION_FALLBACK_MESSAGE;
        }

        const prompt = buildDescriptionPrompt(playlist);

        for (const model of OPENROUTER_MODELS) {
            for (let attempt = 1; attempt <= OPENROUTER_MAX_RETRIES_PER_MODEL; attempt += 1) {
                const response = await fetch(OPENROUTER_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`,
                        "HTTP-Referer": window.location.origin,
                        "X-Title": "Music Playlist Explorer"
                    },
                    body: JSON.stringify({
                        model,
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        temperature: 0.7
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data?.choices?.[0]?.message?.content?.trim();
                    if (text) {
                        return text;
                    }
                    break;
                }

                const errorText = await response.text();
                console.error(`OpenRouter ${model} failed (${response.status}): ${errorText}`);

                const retryAfter = Number(response.headers.get("Retry-After"));
                const shouldRetry =
                    response.status === 429
                    && attempt < OPENROUTER_MAX_RETRIES_PER_MODEL
                    && Number.isFinite(retryAfter)
                    && retryAfter > 0;

                if (shouldRetry) {
                    await delay(retryAfter * 1000);
                    continue;
                }

                break;
            }
        }

        return DESCRIPTION_FALLBACK_MESSAGE;
    } catch (error) {
        console.error(error);
        return DESCRIPTION_FALLBACK_MESSAGE;
    }
}

function createPlaylistCard(playlist) {
    const card = document.createElement("li");
    card.className = "playlist-card";
    card.dataset.playlistId = playlist.id;

    card.innerHTML = `
        <article class="playlist-tile">
            <img class="playlist-cover" src="${playlist.Cover}" alt="Cover art for ${playlist.Title}">
            <div class="playlist-meta">
                <h3 class="playlist-name">${playlist.Title}</h3>
                <p class="playlist-author">${playlist.Creator}</p>
            </div>
            <button class="like-button" type="button" aria-pressed="${playlist.isLiked}">
                <span class="like-icon" aria-hidden="true">${playlist.isLiked ? "♥" : "♡"}</span>
                <span class="like-count">${playlist.Likes}</span>
            </button>
        </article>
    `;

    const likeButton = card.querySelector(".like-button");
    const likeIcon = card.querySelector(".like-icon");
    const likeCount = card.querySelector(".like-count");

    likeButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (playlist.isLiked) {
            playlist.isLiked = false;
            playlist.Likes = Math.max(0, playlist.Likes - 1);
        } else {
            playlist.isLiked = true;
            playlist.Likes += 1;
        }

        likeButton.setAttribute("aria-pressed", String(playlist.isLiked));
        likeIcon.textContent = playlist.isLiked ? "♥" : "♡";
        likeCount.textContent = String(playlist.Likes);
    });

    card.addEventListener("click", () => {
        currentModalPlaylist = playlist;
        populateModalContent(playlist);
        openModal();
    });
    return card;
}

function renderNoPlaylistsMessage() {
    playlistGrid.innerHTML = "";
    const emptyState = document.createElement("li");
    emptyState.className = "playlist-empty-state";
    emptyState.textContent = "No playlists found";
    playlistGrid.appendChild(emptyState);
}

function renderPlaylistCards(playlists) {
    playlistGrid.innerHTML = "";

    if (!Array.isArray(playlists) || playlists.length === 0) {
        renderNoPlaylistsMessage();
        return;
    }

    playlists.forEach((playlist) => {
        const card = createPlaylistCard(playlist);
        playlistGrid.appendChild(card);
    });
}

async function initializePlaylistGallery() {
    try {
        const response = await fetch("./data/data.json");
        if (!response.ok) {
            throw new Error("Failed to load playlist data.");
        }

        const playlists = await response.json();
        playlistsData = playlists;
        renderPlaylistCards(playlistsData);
        featuredPlaylist = pickRandomFeaturedPlaylist(playlistsData);
        renderFeaturedPlaylist(featuredPlaylist);
        setActiveView("all");
    } catch (error) {
        console.error(error);
        renderNoPlaylistsMessage();
        renderFeaturedPlaylist(null);
    }
}

closeModalButton.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

playlistModal.addEventListener("click", (event) => {
    event.stopPropagation();
});

shuffleButton.addEventListener("click", () => {
    if (!currentModalPlaylist) {
        return;
    }

    currentModalPlaylist.songs = shuffleSongs(currentModalPlaylist.songs);
    populateModalContent(currentModalPlaylist);
});

getDescriptionButton.addEventListener("click", async () => {
    if (!currentModalPlaylist) {
        playlistDescription.textContent = DESCRIPTION_FALLBACK_MESSAGE;
        return;
    }

    playlistDescription.textContent = "Generating description…";
    getDescriptionButton.disabled = true;

    const description = await getPlaylistDescription(currentModalPlaylist);
    playlistDescription.textContent = description || DESCRIPTION_FALLBACK_MESSAGE;
    getDescriptionButton.disabled = false;
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        setActiveView(link.dataset.view);
    });
});

initializePlaylistGallery();

