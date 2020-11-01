class Network {
    constructor({ host }) {
        this.host = host;
    }

    parseManifestURL({ url, fileResolution, fileResolutionTag, hostTag}) {
        return url.replace(fileResolutionTag, fileResolution).replace(hostTag, this.host);
    }

    async fetchFile(url) {
        const response = await fetch(url);
        return response.arrayBuffer();
    }

    async getProperResolution(url) {
        const startMs = Date.now();
        const response = await fetch(url);
        await response.arrayBuffer();
        const endMs = Date.now();
        const durationInMs = (endMs - startMs);
        
        // Ao invés de calcular o throughPut, irá ser calculado pelo tempo
        const resolutions = [
            // De 3s até 20s
            { start: 3001, end: 20000, resolution: 144 },
            // Até 3s
            { start: 901, end: 3000, resolution: 360 },
            // Menos de 1s
            { start: 0, end: 900, resolution: 720 },
        ];

        const item = resolutions.find(item => {
            return item.start <= durationInMs && item.end >= durationInMs
        });

        const LOWEST_RESOLUTION = 144;
        // Se for mais de 30s
        if (!item) return LOWEST_RESOLUTION;

        return item.resolution;
    }
}