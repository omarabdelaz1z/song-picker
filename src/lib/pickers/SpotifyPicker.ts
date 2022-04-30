import fetch, { RequestInit } from "node-fetch";
import {
	PlaylistRetriever,
	Track,
	TrackRetriever,
} from "../../types/interfaces";
import {
	SpotifyAlbumResponse,
	SpotifyAuthResponse,
	SpotifyPlaylistResponse,
	SpotifyTrackResponse,
} from "../../types/entities/spotify";
import {
	SPOTIFY_SINGLE_MATCHER,
	SPOTIFY_PLAYLIST_MATCHER,
	SPOTIFY_ALBUM_MATCHER,
	SPOTIFY_API_AUTH_URL,
	SINGLE_SYMBOL,
	LIST_SYMBOL,
} from "../../utils/constants";

const parseTrack = (response: SpotifyTrackResponse): Track => {
	if (response.error) throw new Error(`${response.error.message}`);

	const artists = response.artists.map((artist) => artist.name);

	return {
		title: `${artists.join(" ")} - ${response.name}`,
		name: response.name,
		artist: artists.join(" "),
		url: `https://open.spotify.com/track/${response.id}`,
		duration: response.duration_ms,
		live: false,
		spotify: true,
		key: response.id,
	};
};

export class SpotifyAuth {
	private auth: SpotifyAuthResponse;
	private timestamp: number;

	
	public getAuth = async (): Promise<SpotifyAuthResponse> => {
		const timestamp: number = new Date().getTime();

		if (!this.auth || timestamp - this.timestamp > this.auth.expires_in) {
			const auth = await this.fetchAuth();

			this.auth = auth;
			this.timestamp = timestamp;
		}

		return this.auth;
	};

	/**
	 *
	 * @throws
	 */
	private fetchAuth = async (): Promise<SpotifyAuthResponse> => {
		const options: RequestInit = {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${Buffer.from(
					`${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`,
				).toString("base64")}`,
			},
		};

		const response = await fetch(SPOTIFY_API_AUTH_URL, options);
		if (!response.ok) throw new Error("Failed to authenticate with spotify");

		return response.json();
	};
}

export class SpotifyTrack implements TrackRetriever {
	private spotifyAuth: SpotifyAuth;
	public type = SINGLE_SYMBOL;

	constructor(spotifyAuth: SpotifyAuth) {
		this.spotifyAuth = spotifyAuth;
	}

	generateKey = (query: string) => query.match(SPOTIFY_SINGLE_MATCHER)[1];

	fetch = async (url: string) => {
		const id = url.match(SPOTIFY_SINGLE_MATCHER)[1];

		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { token_type, access_token } = await this.spotifyAuth.getAuth();

		const options: RequestInit = {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `${token_type} ${access_token}`,
			},
		};

		return fetch(`https://api.spotify.com/v1/tracks/${id}`, options)
			.then((response) => response.json())
			.then(parseTrack);
	};
}

export class SpotifyPlaylist implements PlaylistRetriever {
	private spotifyAuth: SpotifyAuth;
	public type = LIST_SYMBOL;

	constructor(spotifyAuth: SpotifyAuth) {
		this.spotifyAuth = spotifyAuth;
	}

	generateKey = (query: string) => query.match(SPOTIFY_PLAYLIST_MATCHER)[1];

	private next = (URL: string, token: string, tracks: Track[] = []) => {
		const options: RequestInit = {
			headers: {
				Accept: "application/json",
				Authorization: token,
			},
		};

		return fetch(URL, options)
			.then((response) => response.json())
			.then(this.parseResponse)
			.then((data) => {
				const response = [...tracks, ...data.tracks];
				if (data.next) return this.next(data.next, token, response);
				return response;
			});
	};

	fetch = async (url: string) => {
		if (typeof url === "undefined" || !url) throw new Error("Url is missing.");

		const id = url.match(SPOTIFY_PLAYLIST_MATCHER)?.[1];
		const URL = `https://api.spotify.com/v1/playlists/${id}/tracks`;

		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { token_type, access_token } = await this.spotifyAuth.getAuth();
		const token = `${token_type} ${access_token}`;

		return this.next(URL, token, []);
	};

	parseResponse = (response: SpotifyPlaylistResponse) => {
		if (response.error) throw new Error(`${response.error.message} `);

		return {
			tracks: response.items.map((item) => parseTrack(item.track)),
			next: response.next,
		};
	};
}

export class SpotifyAlbum implements PlaylistRetriever {
	private spotifyAuth: SpotifyAuth;
	public type = LIST_SYMBOL;

	constructor(spotifyAuth: SpotifyAuth) {
		this.spotifyAuth = spotifyAuth;
	}

	generateKey = (query: string) => {
		if (typeof query === "undefined" || !query)
			throw new Error("query is undefined");
		return query.match(SPOTIFY_ALBUM_MATCHER)?.[1];
	};

	fetch = async (url: string) => {
		const id = url.match(SPOTIFY_ALBUM_MATCHER)[1];

		try {
			const authorization = await this.spotifyAuth.getAuth();
			// eslint-disable-next-line @typescript-eslint/naming-convention
			const { token_type, access_token } = authorization;

			const options: RequestInit = {
				headers: {
					Accept: "application/json",
					Authorization: `${token_type} ${access_token}`,
				},
			};

			return await fetch(
				`https://api.spotify.com/v1/albums/${id}/tracks`,
				options,
			)
				.then((response) => response.json())
				.then(this.parseResponse);
		} catch (error) {
			throw new Error(JSON.stringify(error));
		}
	};

	parseResponse = (response?: SpotifyAlbumResponse): Track[] => {
		if (response.error) throw new Error(`${response.error.message}`);

		return response.items.map((item) => parseTrack(item));
	};
}
