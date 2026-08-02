class CustomStreamProvider {
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
        const res = await fetch(`${this.api}/episodes/${animeId}`);
        if (!res.ok) return [];
        return await res.json();
    }

    async findEpisodeServers(episodeId) {
        let epNum = "1";
        if (typeof episodeId === "number" || typeof episodeId === "string") {
            epNum = String(episodeId);
        } else if (typeof episodeId === "object" && episodeId !== null) {
            epNum = String(episodeId.number || episodeId.id || "1");
        }

        if (epNum.includes("-")) {
            const parts = epNum.split("-");
            epNum = parts[parts.length - 1];
        }

        return [
            {
                name: "Godchair Server",
                url: epNum
            }
        ];
    }

    async findEpisodeServer(episodeId) {
        return this.findEpisodeServers(episodeId);
    }

    async findVideoSources(serverId) {
        const epNum = typeof serverId === "object" && serverId !== null ? (serverId.url || serverId.id || "1") : String(serverId);
        
        const res = await fetch(`${this.api}/episode/197824-${epNum}/sources`);
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
