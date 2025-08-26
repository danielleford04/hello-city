
const calculateDistance = (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    unit: 'km' | 'mi' = 'km'
) => {
    return (
        ((Math.acos(
                Math.sin((origin.latitude * Math.PI) / 180) *
                Math.sin((destination.latitude * Math.PI) / 180) +
                Math.cos((origin.latitude * Math.PI) / 180) *
                Math.cos((destination.latitude * Math.PI) / 180) *
                Math.cos(((origin.longitude - destination.longitude) *
                    Math.PI) / 180)
            ) * 180) /
            Math.PI) *
        60 * 1.1515 *
        (unit === 'mi' ? 1.609344 : 1)
    );
};

export function areTwoLocationsWithin500Feet(    origin: { latitude: number; longitude: number },
                                           destination: { latitude: number; longitude: number }) {
    const FiveHundredFtInMiles = 500/5280;
    if (calculateDistance(origin, destination, 'mi')<FiveHundredFtInMiles){
        return true
    } else {
        return false;
    }
}
