export const YOUTUBE_RESPONSE_MATCHER = /var ytInitialData = (.+?)<\/script>/im;
export const YOUTUBE_SEARCH_SINGLE_MATCHER = /.+/;
export const YOUTUBE_PLAYLIST_MATCHER =
	/^.*youtube\.com\/.*list=([a-zA-Z0-9-_^#]+)?/i;

export const SPOTIFY_PLAYLIST_MATCHER =
	/^https:\/\/open.spotify.com\/playlist\/([a-zA-Z0-9]+)\??/i;
export const SPOTIFY_ALBUM_MATCHER =
	/^https:\/\/open.spotify.com\/album\/([a-zA-Z0-9]+)\??/i;
export const SPOTIFY_SINGLE_MATCHER =
	/^https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)\??/i;

/** Matches for single track resolvers */
export const SINGLE_SYMBOL = Symbol("track-retriever");
/** Matches for list-like resolvers */
export const LIST_SYMBOL = Symbol("list-retriever");

export const SPOTIFY_API_AUTH_URL =
	"https://accounts.spotify.com/api/token?grant_type=client_credentials";