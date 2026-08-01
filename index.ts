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
            // Grab ID or whatever identifier is present inside the media object wrapper
            cleanQuery = query.id ? query.id.toString() : (query.romaji || query.english || "");
        }

        const targetUrl = (!cleanQuery || cleanQuery.includes("[object Object]"))
            ? `${this.api}/search?query=__empty__`
            : `${this.api}/search?query=${encodeURIComponent(cleanQuery)}`;

        const res = await fetch(targetUrl);
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
