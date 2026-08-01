class Provider {
    // Your Tailscale or local server address
    private api = "http://100.89.97.87:8000"

    getSettings() {
        return {
            supportsDub: false,
        }
    }

    // Search anime by title or ID
    async search(query) {
        // If Seanime passes a numeric AniList ID as a query, handle it gracefully
        let searchUrl = `${this.api}/search?query=${encodeURIComponent(query)}`;
        
        const res = await fetch(searchUrl);
        const data = await res.json();
        
        // Ensure data format matches what Seanime expects
        // (Miruro-API typically returns a list of results)
        const results = Array.isArray(data) ? data : (data.results || [data]);

        return results.map(item => ({
            id: item.id ? item.id.toString() : query,
            title: item.title || item.name || query,
            image: item.image || item.poster || "",
            url: item.url || ""
        }));
    }

    // Get episodes for a specific anime
    async findEpisodes(animeId) {
        // If the ID is a numeric AniList ID, we might need to search or query the specific endpoint format your API uses
        const res = await fetch(`${this.api}/anime/${animeId}/episodes`);
        
        if (!res.ok) {
            // Fallback: if direct ID lookup fails, try searching the ID first to get the correct slug/internal ID
            return [];
        }

        const data = await res.json();
        const episodes = Array.isArray(data) ? data : (data.episodes || []);

        return episodes.map((ep, index) => ({
            id: ep.id || `${animeId}-${index + 1}`,
            number: ep.number || (index + 1),
            title: ep.title || `Episode ${index + 1}`,
            url: ep.url || ep.link || ""
        }));
    }

    // Get the direct video stream links (M3U8) for an episode
    async findEpisodeServer(episodeId) {
        const res = await fetch(`${this.api}/episode/${episodeId}/sources`);
        const data = await res.json();

        return {
            videoUrl: data.url || data.streamUrl || "",
            headers: data.headers || {},
            subtitles: data.subtitles || []
        };
    }
}
