export interface SpotifyResponse {
	error?: {
		status: number;
		message: string;
	};
}

export interface SpotifyTrackResponse extends SpotifyResponse {
	id: string;
	name: string;
	artists: {
		name: string;
	}[];
	duration_ms: number;
}

export interface SpotifyAlbumResponse extends SpotifyResponse {
	items?: SpotifyTrackResponse[];
}

export interface SpotifyPlaylistResponse extends SpotifyResponse {
	items?: {
		track: SpotifyTrackResponse;
	}[];
	next?: string;
}

export interface SpotifyAuthResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}