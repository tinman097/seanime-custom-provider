class Provider {
    api = "http://100.89.97.87:8000";

    getSettings() {
        return {
            supportsDub: false,
        };
    }

  async search(query) {
        let searchTerm = "";

        if (typeof query === "string") {
            searchTerm = query;
        } else if (typeof query === "object" && query !== null) {
            // Extract title fields natively provided by Seanime's media object wrapper
            searchTerm = query.romaji || query.english || query.native || query.title || "";
        }

        if (!searchTerm || searchTerm.includes("[object Object]") || /^\d+$/.test(searchTerm)) {
            return [];
        }

        const res = await fetch(`${this.api}/search?query=${encodeURIComponent(searchTerm)}`);
        if (!res.ok) return [];
        
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.results || []);

        return results.map(item => ({
            id: item.id ? item.id.toString() : "",
            title: item.title || item.name || "",
            image: item.image || "",
            url: item.url || ""
        }));
    }
    async findEpisodes(animeId) {
    const res = await fetch(`${this.api}/episodes/${animeId}`);
    if (!res.ok) return [];

    const data = await res.json();
    
    // Automatically find the array whether your API returns a root array, 
    // or wraps it inside an object (like data.episodes or data.results)
    const episodes = Array.isArray(data) ? data : (data.episodes || data.results || data.data || []);

    return episodes.map((ep, index) => ({
        id: ep.id ? ep.id.toString() : `${animeId}-${index + 1}`,
        number: ep.number || ep.episode || (index + 1),
        title: ep.title || ep.name || `Episode ${index + 1}`,
        url: ep.url || ep.link || ""
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
