class Provider {
    api = "http://100.89.97.87:8000";

    getSettings() {
        return {
            supportsDub: false,
        };
    }

    // Text searches only
    async search(query) {
        // Skip if query is just a numeric AniList ID
        if (!isNaN(query)) {
            return [];
        }

        const res = await fetch(`${this.api}/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.results || []);

        return results.map(item => ({
            id: item.id.toString(),
            title: item.title || item.name,
            image: item.image || "",
            url: item.url || ""
        }));
    }

    // Handle episode listing requested via anime ID
    async findEpisodes(animeId) {
        // Query your API's specific endpoint for episodes using the ID/slug
        const res = await fetch(`${this.api}/anime/${animeId}/episodes`);
        if (!res.ok) return [];

        const data = await res.json();
        const episodes = Array.isArray(data) ? data : (data.episodes || []);

        return episodes.map((ep, index) => ({
            id: ep.id || `${animeId}-${index + 1}`,
            number: ep.number || (index + 1),
            title: ep.title || `Episode ${index + 1}`,
            url: ep.url || ""
        }));
    }

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
