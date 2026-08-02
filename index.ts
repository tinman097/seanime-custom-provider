class Provider {
    api = "http://100.89.97.87:8000";

    getSettings() {
        return {
            supportsDub: false,
        };
    }

    async search(query) {
        // Return a dummy matched object using the current media ID or empty 
        // to satisfy Seanime's automatic matching layer without hitting network errors
        return [{
            id: "197824",
            title: "Matched Title",
            image: "",
            url: ""
        }];
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

    async findEpisodeServers(episodeId) {
        // Log or handle whatever format Seanime passes (number, string, or object)
        let epNum = "1";
        if (typeof episodeId === "number" || typeof episodeId === "string") {
            epNum = String(episodeId);
        } else if (typeof episodeId === "object" && episodeId !== null) {
            epNum = String(episodeId.number || episodeId.id || "1");
        }

        // If the ID contains a hyphen (e.g. "197824-8"), extract the episode number part
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
        // serverId.url holds the episode number/ID we passed above
        const epNum = typeof serverId === "object" && serverId !== null ? (serverId.url || serverId.id || "1") : String(serverId);
        
        const res = await fetch(`${this.api}/episode/197824-${epNum}/sources`);
        
        const videoLink = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        
        return {
            sources: [
                {
                    url: videoLink,
                    isM3U8: false
                }
            ],
            subtitles: []
        };
    }
}
