import {
	Matcher,
	PickerStrategySelector,
	StrategyConfig,
} from "../../types/interfaces";
import {
	YOUTUBE_PLAYLIST_MATCHER,
	YOUTUBE_SEARCH_SINGLE_MATCHER,
} from "../../utils/constants";
import { YoutubePlaylist, YoutubeTrack } from "../pickers/YoutubePicker";

export default class YoutubeStrategySelector implements PickerStrategySelector {
	private options: Matcher[];

	constructor(config: StrategyConfig) {
		this.options = [
			{
				matcher: YOUTUBE_PLAYLIST_MATCHER,
				strategy: new YoutubePlaylist({ ...config }),
			},
			{
				matcher: YOUTUBE_SEARCH_SINGLE_MATCHER,
				strategy: new YoutubeTrack({ ...config }),
			},
		];
	}

	select = (url: string) => {
		const selected = this.options.find((strategy) =>
			strategy.matcher.test(url),
		);
		return selected ? selected.strategy : null;
	};
}
