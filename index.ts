class CustomStreamProvider implements OnlineStreamProvider {
    
    async search(query: string): Promise<AnimeProvider_Anime[]> {
        const response = await IndividualRequest.get(`http://100.89.97.87:8000/search?q=${encodeURIComponent(query)}`);
        const data = response.json();
        
        return data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            url: item.url,
            image: item.image,
        }));
    }

    async findEpisodes(animeId: string): Promise<AnimeProvider_Episode[]> {
        const response = await IndividualRequest.get(`http://100.89.97.87:8000/anime/${animeId}/episodes`);
        const data = response.json();

        return data.map((ep: any) => ({
            id: ep.id.toString(),
            number: ep.number,
            title: ep.title,
            url: ep.url,
        }));
    }

    async findEpisodeServer(episodeId: string): Promise<AnimeProvider_Video[]> {
        const response = await IndividualRequest.get(`http://100.89.97.87:8000/episode/${episodeId}/streams`);
        const data = response.json();

        return data.map((stream: any) => ({
            url: stream.url,
            quality: stream.quality || "1080p",
            type: stream.type || "sub",
        }));
    }
}
