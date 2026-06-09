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

Modal:
The modal uses a full-screen semi-transparent overlay and a centered floating content panel with rounded corners and a visible shadow.  
It opens when a playlist card is clicked, and closes from either the X button or clicking outside the modal panel.

Responsive Design: 
I used Flexbox to keep the layout responsive across screen sizes.  
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

### AI Feature Spec (Milestone 8)
[Leave blank — fill in before Milestone 8]

### Decisions Log
[One entry per milestone where you make spec-informed decisions]
Milestone 1: Used a semantic page structure (header, main, footer) with a dedicated playlist-cards gallery container, and matched card fields to the planned playlist data (image, name, author, likes). Added a modal overlay structure with hard-coded playlist/song placeholders and outside-click-to-close behavior so modal interactions align with the UI and Interaction Rules.
Milestone 2: Completed visual styling and responsiveness. I added rose-themed branding, rock-style typography, and polished card styling (spacing, shadows, hover lift). I also improved modal presentation with a centered pop-up overlay and made the layout adapt better across desktop, tablet, and mobile using Flexbox. Finally, I added Featured/All nav behavior and fixed modal close behavior by ensuring hidden overlays are not displayed.