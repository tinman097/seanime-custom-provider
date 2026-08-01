class Provider {
    // Define your API base URL (can also use user configuration variables)
    private api = "http://your-server-ip:port"

    getSettings() {
        return {
            supportsDub: false,
        }
    }

    // Search anime by title
    async search(query) {
        const res = await fetch(`${this.api}/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        // Return array matching Seanime's expected search format
        return data.map(item => ({
            id: item.id.toString(),
            title: item.title,
            image: item.image,
            url: item.url
        }));
    }

    // Get episodes for a specific anime ID
    async findEpisodes(animeId) {
        const res = await fetch(`${this.api}/anime/${animeId}/episodes`);
        const data = await res.json();

        return data.episodes.map(ep => ({
            id: ep.id,
            number: ep.number,
            title: ep.title,
            url: ep.url
        }));
    }

    // Get the direct video stream links (M3U8) and subtitles for an episode
    async findEpisodeServer(episodeId) {
        const res = await fetch(`${this.api}/episode/${episodeId}/sources`);
        const data = await res.json();

        return {
            videoUrl: data.url, // M3U8 link returned by your API
            headers: data.headers || {},
            subtitles: data.subtitles || []
        };
    }
}
