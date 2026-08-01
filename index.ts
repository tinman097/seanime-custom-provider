class Provider {
    api = "http://100.89.97.87:8000";

    getSettings() {
        return {
            supportsDub: false,
        };
    }

  async search(query) {
        let cleanQuery = "";

        if (typeof query === "string") {
            cleanQuery = query;
        } else if (typeof query === "object" && query !== null) {
            // Seanime passes the media object here; pull titles safely in order of preference
            if (query.title) {
                cleanQuery = typeof query.title === "string" ? query.title : (query.title.romaji || query.title.english || "");
            }
            if (!cleanQuery) {
                cleanQuery = query.romaji || query.english || query.native || "";
            }
        }

        if (!cleanQuery || cleanQuery.includes("[object Object]") || /^\d+$/.test(cleanQuery)) {
            return [];
        }

        const res = await fetch(`${this.api}/search?query=${encodeURIComponent(cleanQuery)}`);
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
