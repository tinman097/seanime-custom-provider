class Provider {
    api = "http://100.89.97.87:8000";

    getSettings() {
        return {
            supportsDub: false,
        };
    }

    async search(query) {
        // If Seanime passes [object Object] or an invalid string, return empty immediately 
        // so it falls through cleanly to findEpisodes using the AniList ID.
        if (!query || typeof query !== "string" || query.includes("[object Object]")) {
            return [];
        }

        const res = await fetch(`${this.api}/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.results || data.data || []);

        return results.map(item => ({
            id: item.id ? item.id.toString() : "",
            title: item.title ? (item.title.romaji || item.title.english || item.title) : (item.name || ""),
            image: item.coverImage ? item.coverImage.large : (item.image || ""),
            url: item.url || ""
        }));
    }

    async findEpisodes(animeId) {
        const targetId = typeof animeId === "object" && animeId !== null ? (animeId.id || "") : animeId;
        if (!targetId) return [];

        const res = await fetch(`${this.api}/episodes/${targetId}`);
        if (!res.ok) return [];

        const data = await res.json();
        const episodes = Array.isArray(data) ? data : (data.episodes || data.results || data.data || []);

        return episodes.map((ep, index) => ({
            id: ep.id ? ep.id.toString() : `${targetId}-${index + 1}`,
            number: ep.number || ep.episode || (index + 1),
            title: ep.title || ep.name || `Episode ${index + 1}`,
            url: ep.url || ep.link || ""
        }));
    }

    async findEpisodeServer(episodeId) {
        const res = await fetch(`${this.api}/episode/${episodeId}/sources`);
        if (!res.ok) return { videoUrl: "", headers: {}, subtitles: [] };

        const data = await res.json();

        return {
            videoUrl: data.url || data.streamUrl || "",
            headers: data.headers || {},
            subtitles: data.subtitles || []
        };
    }
}
