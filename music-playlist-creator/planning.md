## Music Playlist Explorer — Planning Spec

### Data Shape
[Leave blank — fill in before Milestone 3]

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

### Function Specs
[Add function specs here as you plan each milestone]

### AI Feature Spec (Milestone 8)
[Leave blank — fill in before Milestone 8]

### Decisions Log
[One entry per milestone where you make spec-informed decisions]
Milestone 1: Used a semantic page structure (header, main, footer) with a dedicated playlist-cards gallery container, and matched card fields to the planned playlist data (image, name, author, likes). Added a modal overlay structure with hard-coded playlist/song placeholders and outside-click-to-close behavior so modal interactions align with the UI and Interaction Rules.
Milestone 2: 