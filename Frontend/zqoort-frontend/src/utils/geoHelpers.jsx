export const toLeafletCoords = (geo) => geo && geo.length >= 2 ? [geo[1], geo[0]] : null;
export const toGeoJsonCoords = (leaflet) => leaflet && leaflet.length >= 2 ? [leaflet[1], leaflet[0]] : null;
export const createGeoJsonLocation = (lat, lng) => ({ type: 'Point', coordinates: [lng, lat] });
export const formatDistance = (m) => m < 1000 ? `${Math.round(m)} م` : `${(m / 1000).toFixed(2)} كم`;