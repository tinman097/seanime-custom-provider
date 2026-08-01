function search(query: string) {
    const response = Http.get(`http://100.89.97{encodeURIComponent(query)}`);
    const data = JSON.parse(response.body);
    return data.results; 
}

function findEpisodes(id: string) {
    const response = Http.get(`http://100.89.97{id}`);
    const data = JSON.parse(response.body);
    return data.episodes;
}

function VideoSources(episodeId: string) {
    const response = Http.get(`http://100.89.97{episodeId}`);
    const data = JSON.parse(response.body);
    return {
        videos: data.sources,
        subtitles: []
    };
}
