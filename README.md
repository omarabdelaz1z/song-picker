# song-picker
> Fetch meta data about a song given a url or query.
- Supports Spotify and Youtube.
  - Spotify: Tracks, Albums and Playlists.
  - Youtube: Search Queries, Single Urls, Playlists, Radio Mixes.
- Typical Usecase: Discord Music Bots.
  - You can pass a query (url/text) and fetch related meta data to either download the song using a ytdl package or for whatever reason.

## Install
```
npm install song-picker
```

## Usage
```typescript
import SongPicker from "song-picker";

const picker = new SongPicker();

// Spotify Single Tracks
picker.fetch("https://open.spotify.com/track/2A4xTe1uOdRKKJUyilAqrF");
```
```json
{
  "title": "Warda - Batwanes Beek",
  "name": "Batwanes Beek",
  "artist": "Warda",
  "url": "https://open.spotify.com/track/2A4xTe1uOdRKKJUyilAqrF",
  "duration": 804402,
  "live": false,
  "spotify": true,
  "key": "2A4xTe1uOdRKKJUyilAqrF"
}
```

```typescript
// Spotify Album Tracks
picker.fetch("https://open.spotify.com/album/6YYFCiaPLLTCJQzosw3x8A?");
```
```json
[
  {
    "title": "Sabah - Robbama",
    "name": "Robbama",
    "artist": "Sabah",
    "url": "https://open.spotify.com/track/4haXLXSiFrUD4v6EUJlwqD",
    "duration": 376453,
    "live": false,
    "spotify": true,
    "key": "4haXLXSiFrUD4v6EUJlwqD"
  },
  ...
  ...
  ,
  {
    "title": "Sabah - Saat Saat",
    "name": "Saat Saat",
    "artist": "Sabah",
    "url": "https://open.spotify.com/track/23gfhkzbv9Q0h6sXTWXXiL",
    "duration": 745826,
    "live": false,
    "spotify": true,
    "key": "23gfhkzbv9Q0h6sXTWXXiL"
  },
  ...
  ...
]
```

```typescript
  // Query; it would search in the youtube url.
  picker.fetch("3enba el melouk");
```
```json
{
  "url": "https://www.youtube.com/watch?v=4_vtOKcfCG8",
  "title": "Ahmed Saad Ft. 3enba & Double Zuksh - El Melouk ( Music Video ) احمد سعد وعنبة و دبل زوكش - الملوك",
  "live": false,
  "duration": 250000,
  "artist": "Ahmed Saad",
  "name": "El Melouk",
  "key": "4_vtOKcfCG8",
  "spotify": false
}
```


```typescript
  // Youtube Single Track
  picker.fetch("https://youtu.be/_bXJIxe2SUQ");
```
```json
{
  "url": "https://youtu.be/_bXJIxe2SUQ",
  "title": "Engelbert Humperdinck - A Man Without Love | Moon Knight 🌙  Soundtrack |",
  "live": false,
  "duration": 199000,
  "artist": "Engelbert Humperdinck",
  "name": "A Man Without Love",
  "key": "_bXJIxe2SUQ",
  "spotify": false
}
```

```typescript
  // Youtube Playlist
  picker.fetch("https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj");
```
```json
[
  {
    "url": "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    "title": "Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars",
    "live": false,
    "duration": 271000,
    "artist": "Mark Ronson",
    "name": "Uptown Funk",
    "key": "OPf0YbXqDm0",
    "spotify": false
  },
  {
    "url": "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    "title": "Ed Sheeran - Shape of You (Official Music Video)",
    "live": false,
    "duration": 264000,
    "artist": "Ed Sheeran",
    "name": "Shape of You",
    "key": "JGwWNGJdvx8",
    "spotify": false
  },
  ...
  ...
  ...
  ,
  {
    "url": "https://www.youtube.com/watch?v=cRi-x2r88no",
    "title": "Jamie Miller - Here's Your Perfect (Official Music Video)",
    "live": false,
    "duration": 170000,
    "artist": "Jamie Miller",
    "name": "Here's Your Perfect",
    "key": "cRi-x2r88no",
    "spotify": false
  }
  ,
  ... 100 more items
]
```

### Author
Omar Abdelaziz

- GitHub: [github/omarabdelaz1z](https://github.com/omarabdelaz1z)

### Liscense
### Keywords

