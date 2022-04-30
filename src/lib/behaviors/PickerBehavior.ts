import CacheBehavior from "./CacheBehavior";
import { SpotifyStrategy, YoutubeStrategy } from "../strategies";

export default class SongPicker {
	private cache = new CacheBehavior();
	private strategies = [new SpotifyStrategy(), new YoutubeStrategy()];

	/**
	 *
	 * @throws
	 */
	public fetch = async (url: string) => {
		const strategy = this.determineStrategy(url);
		const key = strategy.generateKey(url);

		const result = this.cache.resolve(strategy, key);
		if (result) return result;

		const response = await strategy.fetch(url);

		if (Array.isArray(response)) this.cache.addPlaylist(key, response);
		else this.cache.addTrack(response.key, response);

		return response;
	};

	private determineStrategy = (url: string) => {
		const selected = this.strategies.find((strategy) => strategy.select(url));
		return selected ? selected.select(url) : null;
	};
}
