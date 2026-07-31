module.exports.geocodeLocation = async (locationText) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`,
        { headers: { "User-Agent": "WonderLust-App" } }
    );
    const data = await res.json();

    if (data.length === 0) {
        return null;
    }

    return {
        lon: parseFloat(data[0].lon),
        lat: parseFloat(data[0].lat)
    };
};