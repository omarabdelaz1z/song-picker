import LRUCache from "lru-cache";
import stringSimilarity from "string-similarity";
import { SINGLE_SYMBOL, MATCH_THRESHOLD } from "../../utils/constants";
import {
	Key,
	PlaylistRetriever,
	Track,
	TrackRetriever,
} from "../../types/interfaces";

export default class CacheBehavior {
	private tracks = new LRUCache<Key, Track>({
		ttl: 1000 * 60 * 60 * 24,
		maxSize: 500,
		sizeCalculation: () => 1,
	});

	private playlists = new LRUCache<Key, Key[]>({
		ttl: 1000 * 60 * 60 * 24,
		maxSize: 500,
		sizeCalculation: () => 1,
	});

	resolve = (strategy: PlaylistRetriever | TrackRetriever, key: Key) => {
		if (strategy.type === SINGLE_SYMBOL)
			return this.resolveTrack(key) || this.resolveBestMatchTrack(key);

		return this.resolvePlaylist(key);
	};

	private resolveBestMatchTrack = (query: string) => {
		if (this.tracks.entries.length === 0) return null;

		const values = Array.from(this.tracks.values());
		const titles = values.map((track) => track.title);
		const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(
			query,
			[...titles, ""],
		);

		if (bestMatch.rating > MATCH_THRESHOLD) return values[bestMatchIndex];
		return null;
	};

	private resolveTrack = (key: Key) => this.tracks.get(key) || null;

	private resolvePlaylist = (id: Key) => {
		const keys = this.playlists.get(id);
		if (!keys) return null;

		return keys.map(this.resolveTrack).filter((track) => track);
	};

	public addTrack = (key: Key, track: Track) => {
		this.tracks.set(key, track);
	};

	public addPlaylist = (key: Key, playlist: Track[]) => {
		playlist.forEach((track) => this.tracks.set(track.key, track));

		this.playlists.set(
			key,
			playlist.map((track) => track.key),
		);
	};
}
