class Provider {
    constructor() {
        this.name = "Godchair Custom Provider";
        this.api = "http://100.89.97.87:8000";
    }

    async search(query) {
        let q = "";
        if (typeof query === "string") {
            q = query;
        } else if (typeof query === "object" && query !== null) {
            q = query.search || query.query || query.title || JSON.stringify(query);
        } else {
            q = String(query);
        }

        const res = await fetch(`${this.api}/search?query=${encodeURIComponent(q)}`);
        if (!res.ok) return [];
        return await res.json();
    }

    async findEpisodes(animeId) {
        let id = "";
        if (typeof animeId === "object" && animeId !== null) {
            id = animeId.id || animeId.mediaId || animeId.url || "132474";
        } else {
            id = String(animeId);
        }

        const res = await fetch(`${this.api}/episodes/${id}`);
        if (!res.ok) return [];
        return await res.json();
    }

    async findEpisodeServers(episodeId) {
        let epId = "";
        if (typeof episodeId === "number" || typeof episodeId === "string") {
            epId = String(episodeId);
        } else if (typeof episodeId === "object" && episodeId !== null) {
            epId = String(episodeId.id || episodeId.number || episodeId.url || "1");
        }

        return [
            {
                name: "Godchair Server",
                url: epId
            }
        ];
    }

    async findEpisodeServer(episodeId) {
        return this.findEpisodeServers(episodeId);
    }

    async findVideoSources(serverId) {
        const epId = typeof serverId === "object" && serverId !== null ? (serverId.url || serverId.id || "1") : String(serverId);
        
        const res = await fetch(`${this.api}/episode/${epId}/sources`);
        if (!res.ok) {
            return {
                sources: [
                    {
                        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        isM3U8: false
                    }
                ],
                subtitles: []
            };
        }
        return await res.json();
    }
}

// Export the instance as `PROVIDER` or let Seanime instantiate `Provider`
if (typeof module !== 'undefined') {
    module.exports = Provider;
}
