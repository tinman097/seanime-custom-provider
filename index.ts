class Provider {
    api = "http://100.89.97.87:8000";

    getSettings() {
        return {
            supportsDub: false,
        };
    }

    async search(query) {
        // CRITICAL FIX: If Seanime passes an AniList ID (pure number), 
        // return an empty array immediately instead of hammering the backend.
        if (!query || /^\d+$/.test(query.toString())) {
            return [];
        }

        const res = await fetch(`${this.api}/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.results || []);

        return results.map(item => ({
            id: item.id.toString(),
            title: item.title || item.name,
            image: item.image || "",
            url: item.url || ""
        }));
    }

    async findEpisodes(animeId) {
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
