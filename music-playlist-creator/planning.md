## Music Playlist Explorer — Planning Spec

### Data Shape
Playlist:
    - id (string) — unique identifier for a playlist used to track clicks, likes, and modal selection.
    - Title (string) — Title of the playlist
    - Creator (string) — Name of the creator who created the playlist
    - Cover (str) — path or URL to the playlist cover image.
    - Likes (int) — Number of likes this playlist has 
    - isLiked (boolean) — whether the current user has liked this playlist in the UI.
    - songs (array<song>) — list of song objects that belong to this playlist.
song:
    - id (string) — unique identifier for a song used for rendering and list operations.
    - title (string) — name of the song shown in the playlist modal.
    - artist (string) — artist name displayed for the song.
    - album (string) — album name shown as supporting song metadata.
    - duration (string) — track length displayed in mm:ss format.
    - coverImage (string) — path or URL to the song/album thumbnail image.




### UI and Interaction Rules
[Leave blank — fill in before Milestone 1]
What are the main sections of the homepage?
Featured Page

The application includes a dedicated Featured page that randomly selects and displays a playlist, showing its:
Playlist image
Playlist name
List of songs, including each song's title, artist, and duration
When the page is refreshed or reloaded, a new random playlist is displayed. The application includes navigation so users can move between the Featured page and the All Playlists page without using the browser's back and forward buttons.
Note: Because the selection algorithm is not truly random, it is possible that the same playlist appears twice in a row.

What happens when a user clicks a playlist card?
Create a modal pop-up view that displays detailed information about a playlist when a user clicks on a playlist tile. The modal should show the playlist's: Cover image, Playlist name, Author, List of songs, including each song's title, artist, and duration. The modal itself should be centered on the screen, not occupy the entire screen, have a shadow to show that it is a pop-up, appear floating on the screen, and darken or shade the background surrounding i

What happens when a user clicks outside the modal?
while clicks outside of the pop-up modal should not affect the content behind it, outside clicks should function to close the modal.

What happens when a user clicks the like icon?
->Implement functionality to allow users to like playlists by clicking a heart icon on each playlist tile. When the heart icon is clicked:
If previously unliked: the like count increases by 1 and there is visual feedback (e.g., the heart changes color)
If previously liked: the like count decreases by 1 and there is visual feedback showing the playlist has been unliked
What does the shuffle button do?
->Enable users to shuffle the songs within a playlist using a shuffle button in the playlist's detail modal. When clicked, the playlist's songs should display in a different order.


### Style 
Main Page: What should it look like, and what should it communicate to the user?
I styled the header and footer so they stand out from the main content, then gave the cards a clean layout with borders, soft shadows, and a hover lift effect.  
The homepage currently shows 3 playlist cards using the same box format for consistency.  
I updated the color palette from red to a rose theme and used a rock-style font pairing (Bebas Neue for titles + Inter for readable text).

Modal:The modal uses a full-screen semi-transparent overlay and a centered floating content panel with rounded corners and a visible shadow.  
It opens when a playlist card is clicked, and closes from either the X button or clicking outside the modal panel.

Responsive Design: I used Flexbox to keep the layout responsive across screen sizes.  
Cards wrap cleanly from desktop to tablet to mobile, the header adjusts on smaller screens, and the modal content stacks better on narrow viewports.

### Function Specs
[Add function specs here as you plan each milestone]
createPlaylistCard(playlist):
- Takes in: one playlist object.
- Returns/produces: one `<li class="playlist-card">` element containing cover image, title, creator, and like count.
- Appends to: does not append directly; returns the card element.
- Uses playlist fields: `id`, `Title`, `Creator`, `Cover`, `Likes`.
renderPlaylistCards(playlists):
- Takes in: array of playlist objects.
- Returns/produces: clears current cards and renders a card for each playlist.
- Appends to: `#playlist-grid` (inside `.playlist-cards`).
- Uses playlist fields: all fields used by `createPlaylistCard`.
renderNoPlaylistsMessage():
- Takes in: no arguments.
- Returns/produces: a message element with text like “No playlists found.”
- Appends to: `#playlist-grid`.
- Uses playlist fields: none.
initializePlaylistGallery(playlists):
- Takes in: array of playlist objects.
- Returns/produces: either rendered cards (if array has items) or empty-state message (if array is empty).
- Appends to: `#playlist-grid`.
- Uses playlist fields: indirectly through render functions.
populateModalContent(playlist):
- Takes in: one selected playlist object (from card click).
- Updates DOM elements: `#modal-content` (replaces modal body content), and uses the existing modal structure inside `#modal-overlay` / `#playlist-modal`.
- What the modal should look like when finished: a centered pop-up showing the selected playlist cover and metadata at the top, followed by a list of song rows with consistent styling and readable song details.
- Information that must be present: playlist `Cover`, `Title`, and `Creator`; for each song in `songs`, include `coverImage`, `title`, `artist`, `album`, and `duration`.


togglePlaylistLike(playlistId):
- Takes in: `playlistId` (string) for the clicked playlist card.
- Data model updates:
  - If `isLiked === false` (like branch): set `isLiked` to `true` and set `Likes = Likes + 1`.
  - If `isLiked === true` (unlike branch): set `isLiked` to `false` and set `Likes = Likes - 1`.
- DOM updates:
  - Update the clicked card's like icon (`♡` -> `♥` on like, `♥` -> `♡` on unlike).
  - Update the clicked card's like count text to match the new `Likes` value.
  - Keep updates scoped to the clicked playlist card only (do not rerender unrelated cards).
- Constraints:
  - `Likes` must never go below `0`.
  - One click should apply exactly one state change (no double increments/decrements).
  - Data state and DOM state must stay in sync after each click.
  - If modal view also shows like state later, both card and modal must reflect the same updated value.

Shuffle approach: preserve original order.
shufflePlaylistSongs(playlistId):
- Takes in: `playlistId` (string) for the currently open playlist.
- Returns: updated shuffled songs array (and updates playlist state used by the modal).
- Original order preservation:
  - Store the initial order once in `playlist.originalSongs` (copy of songs).
  - Keep `playlist.songs` as the active display order.
- UI after shuffling:
  - Modal remains open.
  - Same playlist cover/title/creator stays at top.
  - Song rows appear in a new order immediately after click.
- Multiple shuffle clicks:
  - Each click shuffles the current `playlist.songs` again.
  - The app can continue reshuffling indefinitely.
  - If the new order happens to match the previous order, that is acceptable (random chance).
- Constraints:
  - Song count must not change.
  - No song entries are removed/duplicated.
  - Shuffle affects only the selected playlist in the modal.

-getPlaylistDescription:
            -What does this function take in? Playlist title and song list
            -What does it return? 2–3 sentence description that captures the vibe and theme of the playlist
            -What API does it call and with what prompt structure? OpenRouter API. You are a user that is curious about the playlist mood and vibe and about the songs. Assume you don't know about the songs prior and is quickly trying to find a playlist to listen to. Repond in casual tone but not too informal. 
            -What happens on error? It should say: I'm sorry, I couldn't generate a proper description at this time. Try again later. 


### AI Feature Spec (Milestone 8)
Role: What role should the model play?
Task: What is the model being asked to do? --> generate a description for a music playlist based on its name, author, and song list.
Inputs: What playlist data will you pass to the model? -> Playlist name, author, and song list
Output format: What should the response look like? --> 2–3 sentence description that captures the vibe and theme of the playlist
Constraints: What should the model avoid? --> don't list the songs individually, don't use generic marketing language, don't repeat the title of the playlist verbatim.
Failure behavior: What should the UI show if the API call fails or the model doesn't respond? -> It should say: I'm sorry, I couldn't generate a proper description at this time. Try again later. 

### Decisions Log
[One entry per milestone where you make spec-informed decisions]
Milestone 1: Used a semantic page structure (header, main, footer) with a dedicated playlist-cards gallery container, and matched card fields to the planned playlist data (image, name, author, likes). Added a modal overlay structure with hard-coded playlist/song placeholders and outside-click-to-close behavior so modal interactions align with the UI and Interaction Rules.
Milestone 2: Completed visual styling and responsiveness. I added rose-themed branding, rock-style typography, and polished card styling (spacing, shadows, hover lift). I also improved modal presentation with a centered pop-up overlay and made the layout adapt better across desktop, tablet, and mobile using Flexbox. Finally, I added Featured/All nav behavior and fixed modal close behavior by ensuring hidden overlays are not displayed.

Featured Page:
Goal: create a dedicated Featured page that randomly selects and displays a playlist — with an enlarged cover image and playlist name on the left, and the song list on the right — and to add navigation between the Featured page and the All Playlists page.
-> The layout of the page — what sections exist, what goes where. - The header will be at the top. It will show that the Featured page is higlighted to show you are in the feature page. 
A function spec for your random playlist selection function: what does it take in, what does it return, and when does it run?
->It takes in an object of all the playlists, like a list. It returns one of the playlists and it runs when you click on the Featured page and a random playlist is picked. 
How navigation between the Featured page and the All Playlists page will work. --> You can move between the featured and all playlists page by clicking on the words in the header and it will appear hilighted depending on what page you're in. 