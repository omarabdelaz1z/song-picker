export interface YoutubeTrackResponse {
	playlistPanelVideoRenderer: {
		title: {
			simpleText: string;
		};
		lengthText: {
			simpleText: string;
		};
		videoId: string;
	};
}

export interface YoutubePlaylistResponse {
	contents: {
		twoColumnWatchNextResults: {
			playlist?: {
				playlist: {
					contents: YoutubeTrackResponse[];
				};
			};
		};
	};
}