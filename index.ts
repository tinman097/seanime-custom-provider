class Provider implements OnlineStreamProvider {
    async search(query: any): Promise<AnimeProvider_Anime[]> {
        try {
            const queryString = typeof query === 'object' ? query.title || query.query || JSON.stringify(query) : query;
            const response = await fetch(`http://100.89.97.87:8000/search?query=${encodeURIComponent(queryString)}`);
            const data = await response.json();
            
            const items = data.results || data;
            if (!Array.isArray(items)) return [];

            return items.map((item: any) => ({
                id: item.id ? item.id.toString() : "",
                title: item.title?.english || item.title?.romaji || item.title || "Unknown",
                url: item.url || "",
                image: item.coverImage?.large || item.image || "",
            }));
        } catch (err) {
            console.log("Search error:", err);
            return [];
        }
    }
    async findEpisodes(animeId: any): Promise<AnimeProvider_Episode[]> {
        try {
            const id = typeof animeId === 'object' ? animeId.id || animeId.toString() : animeId;
            const response = await fetch(`http://100.89.97.87:8000/episodes/${id}`);
            const data = await response.json();
            
            const providerKey = Object.keys(data.providers || {})[0];
            const episodesObj = data.providers?.[providerKey]?.episodes || data.episodes;
            const items = episodesObj?.sub || episodesObj || data.results || data;
            
            if (!Array.isArray(items)) return [];

            return items.map((ep: any, index: number) => {
                const epNum = Number(ep.number) || index + 1;
                return {
                    id: ep.id ? ep.id.toString() : `${id}-ep-${epNum}`,
                    number: epNum,
                    title: ep.title || `Episode ${epNum}`,
                    url: ep.url || "",
                };
            });
        } catch (err) {
            console.log("Episodes error:", err);
            return [];
        }
    }}

    async findEpisodeServer(episodeId: any): Promise<any> {
        try {
            const epId = typeof episodeId === 'object' ? episodeId.id || JSON.stringify(episodeId) : episodeId;
            const response = await fetch(`http://100.89.97.87:8000/sources?episodeId=${encodeURIComponent(epId)}&provider=miruro&category=sub`);
            const data = await response.json();

            const streams = data.streams || data.sources || [];
            
            return {
                provider: "playground-extension",
                server: "",
                headers: {
                    "Referer": "https://kwik.cx/"
                },
                videoSources: streams.map((stream: any) => ({
                    url: stream.url || "",
                    type: stream.type === "hls" ? "hls" : "",
                    quality: stream.quality || "default",
                    subtitles: null
                }))
            };
        } catch (err) {
            console.log("Watch error:", err);
            return { provider: "playground-extension", server: "", headers: {}, videoSources: [] };
        }
    }
}
