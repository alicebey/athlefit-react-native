interface Geo {
    latitude: number;
    longitude: number;
}

// Global function for finding haversineDistance
export const haversineDistance = (origin: Geo, destination: Geo) => {
    const earthRadius = 6371; // radius bumi dalam kilometer
    const lat1 = origin.latitude;
    const lon1 = origin.longitude;
    const lat2 = destination.latitude;
    const lon2 = destination.longitude;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;

    return distance;
}