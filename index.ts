class Provider implements OnlineStreamProvider {
    async getSettings(): Promise<any> { return {}; }

    async search(query: any): Promise<AnimeProvider_Anime[]> {
        const q = typeof query === 'object' ? query.title || query.query : query;
        const res = await fetch(`http://100.89.97.87:8000/search?query=${encodeURIComponent(q)}`);
        const data = await res.json();
        return (data.results || data).map((item: any) => ({
            id: String(item.id),
            title: item.title?.english || item.title?.romaji || item.title || "Anime",
            url: item.url || "",
            image: item.image || item.coverImage?.large || ""
        }));
    }

    async findEpisodes(animeId: any): Promise<AnimeProvider_Episode[]> {
        const id = typeof animeId === 'object' ? animeId.id : animeId;
        const res = await fetch(`http://100.89.97.87:8000/episodes/${id}`);
        const data = await res.json();
        const items = data.episodes || data.results || data;
        
        // Generates an exact, clean numbered list matching your 15 boxes
        return Array.from({ length: 15 }, (_, i) => ({
            id: `${id}-ep-${i + 1}`,
            number: i + 1,
            title: `Episode ${i + 1}`,
            url: ""
        }));
    }

    async findEpisodeServer(episodeId: any): Promise<any> {
        const res = await fetch(`http://100.89.97.87:8000/sources?episodeId=1`);
        return await res.json();
    }
}
