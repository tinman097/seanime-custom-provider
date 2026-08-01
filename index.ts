function search(query: string) {
    // Fetches from your Express endpoint
    const response = Http.get(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`);
    const data = JSON.parse(response.body);
    return data.results; 
}

function findEpisodes(id: string) {
    const response = Http.get(`http://localhost:3000/api/episodes/${id}`);
    const data = JSON.parse(response.body);
    return data.episodes;
}

function VideoSources(episodeId: string) {
    const response = Http.get(`http://localhost:3000/api/watch/${episodeId}`);
    const data = JSON.parse(response.body);
    return {
        videos: data.sources,
        subtitles: []
    };
}

registerProvider({
    search,
    findEpisodes,
    VideoSources
});
