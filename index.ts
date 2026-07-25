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
        // Change this line from `/anime/${animeId}/episodes` to `/episodes/${animeId}`
        const response = await IndividualRequest.get(`http://100.89.97.87:8000/episodes/${animeId}`);
        const data = response.json();

        return data.map((ep: any) => ({
            id: ep.id.toString(),
            number: ep.number,
            title: ep.title,
            url: ep.url,
        }));
    }

   async findEpisodes(animeId: string): Promise<AnimeProvider_Episode[]> {
        const response = await IndividualRequest.get(`http://100.89.97.87:8000/episodes/${animeId}`);
        const data = response.json();

        return data.map((ep: any) => ({
            id: ep.id.toString(),
            number: ep.number,
            title: ep.title,
            url: ep.url,
        }));
    }
