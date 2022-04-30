import { PickerStrategySelector } from "../../types/interfaces";
import {
	SPOTIFY_ALBUM_MATCHER,
	SPOTIFY_PLAYLIST_MATCHER,
	SPOTIFY_SINGLE_MATCHER,
} from "../../utils/constants";
import {
	SpotifyAlbum,
	SpotifyAuth,
	SpotifyPlaylist,
	SpotifyTrack,
} from "../pickers/SpotifyPicker";

export default class SpotifyStrategySelector implements PickerStrategySelector {
	private spotifyAuth: SpotifyAuth = new SpotifyAuth();
	private options = [
		{
			matcher: SPOTIFY_PLAYLIST_MATCHER,
			strategy: new SpotifyPlaylist(this.spotifyAuth),
		},
		{
			matcher: SPOTIFY_ALBUM_MATCHER,
			strategy: new SpotifyAlbum(this.spotifyAuth),
		},
		{
			matcher: SPOTIFY_SINGLE_MATCHER,
			strategy: new SpotifyTrack(this.spotifyAuth),
		},
	];

	select = (url: string) => {
		const selected = this.options.find((strategy) =>
			strategy.matcher.test(url),
		);
		return selected ? selected.strategy : null;
	};
}
