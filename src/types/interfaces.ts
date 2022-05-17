export type Key = string;

/** Represents the possible track information that can be given: title, artist, track name, etc.. */
export interface Track {
	/**  */
	/** Title of the song
	 *  resolves to "Artist(s) - Name" for Spotify songs
	 * and "title" for YouTube tracks */
	title: string;

	/** YouTube artist for registered tracks */
	artist?: string;

	/** YouTube song name for registered tracks */
	name?: string;

	/** source URL of the song */
	url: string;

	/** Indicates whether it's a live video */
	live?: boolean;

	/** Indicates whether a song was loaded from Spotify, used when playing */
	spotify: boolean;

	/** A string equal to the id of a spotify track id or youtube video id */
	key: string;

	/** Song duration in milliseconds */
	duration: number;
}

export interface TrackRetriever {
	readonly type: symbol;
	fetch(query: string): Promise<Track>;
	generateKey(query: string): Key;
}

export interface PlaylistRetriever {
	readonly type: symbol;
	fetch(url: string): Promise<Track[]>;
	generateKey(query: string): Key;
}

export interface Matcher {
	matcher: RegExp;
	strategy: PlaylistRetriever | TrackRetriever;
}

export interface PickerStrategySelector {
	select(url: string): PlaylistRetriever | TrackRetriever;
}

export interface PickerConfig {
	SPOTIFY_ID: string;
	SPOTIFY_SECRET: string;
	YOUTUBE_COOKIE: string;
}

export interface StrategyConfig {
	[key: string]: string;
}