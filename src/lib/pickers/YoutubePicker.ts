import ytdl from "ytdl-core";
import fetch from "node-fetch";
import {
	Key,
	PlaylistRetriever,
	Track,
	TrackRetriever,
} from "../../types/interfaces";
import {
	LIST_SYMBOL,
	SINGLE_SYMBOL,
	YOUTUBE_PLAYLIST_MATCHER,
	YOUTUBE_RESPONSE_MATCHER,
} from "../../utils/constants";
import {
	YoutubePlaylistResponse,
	YoutubeTrackResponse,
} from "../../types/entities/youtube";

const filterYoutubeResponse = (response: string) => {
	try {
		const semicolon = /;$/;

		const matchResult = response.match(YOUTUBE_RESPONSE_MATCHER);
		return matchResult?.[1].replace(semicolon, "");
	} catch {
		throw new Error("Error while filtering response");
	}
};

export class YoutubeTrack implements TrackRetriever {
	public type = SINGLE_SYMBOL;

	public fetch = async (query: string) => {
		const url = ytdl.validateURL(query) ? query : await this.getUrl(query);
		return this.getSongDetailsByUrl(url);
	};

	public generateKey = (query: string) =>
		ytdl.validateURL(query) ? ytdl.getURLVideoID(query) : query;

	private getUrl = async (query: string) => {
		const searchUrl = this.prepareSearchQuery(query);

		return fetch(searchUrl)
			.then((response) => response.text())
			.then(filterYoutubeResponse)
			.then(this.parseResponse);
	};

	private parseResponse = (response: string) => {
		const json = JSON.parse(response);
		const hits =
			json.contents.twoColumnSearchResultsRenderer.primaryContents
				.sectionListRenderer.contents[0]?.itemSectionRenderer?.contents;

		const firstHit = hits[0]?.videoRenderer ?? hits[1]?.videoRenderer;

		if (typeof firstHit === "undefined") throw new Error("No results found");

		return `https://www.youtube.com/watch?v=${firstHit.videoId}`;
	};

	private prepareSearchQuery = (query: string): string => {
		const encodedQuery = encodeURIComponent(query);
		return `https://www.youtube.com/results?search_query=${encodedQuery}`;
	};

	public getSongDetailsByUrl = async (url: string): Promise<Track> => {
		try {
			const info = await ytdl.getBasicInfo(url, {
				requestOptions: {
					headers: {
						cookie: process.env.COOKIE,
					},
				},
			});

			if (!info) return null;

			const { title, isLiveContent, lengthSeconds } = info.videoDetails;
			// eslint-disable-next-line no-unsafe-optional-chaining
			const { artist, song: name } = info?.videoDetails?.media;

			return {
				url,
				title,
				live: isLiveContent,
				duration: Number(lengthSeconds) * 1000,
				artist,
				name,
				key: info.videoDetails.videoId,
				spotify: false,
			};
		} catch (error) {
			if (error instanceof Error && error.message.includes("Video unavailable"))
				throw new Error("Video unavailable");

			throw error;
		}
	};
}

export class YoutubePlaylist implements PlaylistRetriever {
	private trackRetriever: YoutubeTrack = new YoutubeTrack();
	public type = LIST_SYMBOL;

	fetch = async (url: string) => {
		const conformedUrl = this.conform(url);

		return fetch(conformedUrl)
			.then((res) => res.text())
			.then(filterYoutubeResponse)
			.then(this.parseResponse);
	};

	conform = (url: string) => {
		const playlistId = url.match(YOUTUBE_PLAYLIST_MATCHER)?.[1];
		return `https://www.youtube.com/watch?v=1&list=${playlistId}`;
	};

	generateKey = (url: Key) => {
		const playlistId = url.match(YOUTUBE_PLAYLIST_MATCHER)?.[1];
		return playlistId;
	};

	parseResponse = async (response: string) => {
		const json: YoutubePlaylistResponse = JSON.parse(response);

		const playlistItems =
			json.contents.twoColumnWatchNextResults?.playlist?.playlist?.contents;

		if (!playlistItems)
			throw new Error("The playlist could be private, empty or not found");

		const filteredItems = playlistItems.filter(
			(item) => typeof item.playlistPanelVideoRenderer !== "undefined",
		);
		
		const tracks = await Promise.all(
			filteredItems.map((item) => this.parseItem(item)),
		);

		return tracks;
	};

	parseItem = async (item: YoutubeTrackResponse) => {
		const url = `https://www.youtube.com/watch?v=${item.playlistPanelVideoRenderer.videoId}`;

		return this.trackRetriever.getSongDetailsByUrl(url);
	};
}
