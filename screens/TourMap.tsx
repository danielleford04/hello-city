import {StyleSheet, View, Text, Dimensions } from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import {useEffect, useState} from "react";
import MapView, {Callout, Marker } from 'react-native-maps';
import Header from "@/components/Header";
import MapViewDirections from 'react-native-maps-directions';
import {areTwoLocationsWithin500Feet} from "@/utilities/utilities";
import StopInfoDisplay from "@/components/StopInfoDisplay";
import {Coordinates, Tour, Stop} from "@/utilities/types";
import MapCalloutContent from "@/components/MapCalloutContent";
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

interface TourMapProps {
    selectedRoute: Tour;
}

export default function TourMap({selectedRoute}:TourMapProps) {
    const [coordinates, setCoordinates ] = useState<Coordinates|null>(null)
    const [activeStop, setActiveStop] = useState<Stop | null>(null)
    const [displayStopInfo, setDisplayStopInfo] = useState<boolean>(false)
    const [waypointCoordinates, setWaypointCoordinates] = useState<Coordinates[] | null>(null)
    const [stops, setStops] = useState<Stop[]|null>(null);

    useEffect(() => {
        getUserCoordinates();
        const intervalId = setInterval(() => {
            console.log('Checking something every 10 seconds!');
            getUserCoordinates();
        }, 10000);

        //todo - check this - seems like its still running when map isn't open
        // Clean up the interval when the component unmounts -
        return () => clearInterval(intervalId);
    }, []);

    useEffect(()=>{
        if (coordinates) {
            checkLocationProximityToNewStops();
        }
    },[coordinates])

    useEffect(()=>{
        const waypointCoords: Coordinates[] = [];
        for (let i=1; i<selectedRoute.stops.length-2; i++) {
            waypointCoords.push({latitude: selectedRoute.stops[i].latitude, longitude: selectedRoute.stops[i].longitude})
        }
        setWaypointCoordinates(waypointCoords)
        setStops(selectedRoute.stops)
    },[selectedRoute])

    function checkLocationProximityToNewStops() {
        if (stops && coordinates) {
            for (let i = 0; i < stops.length; i++) {
                if (areTwoLocationsWithin500Feet(coordinates, {
                    latitude: +stops[i].latitude,
                    longitude: +stops[i].longitude
                }) && stops[i].visited === false) {
                    showLocationDetails(stops[i])
                    const stopsArrayCopy = stops;
                    stopsArrayCopy[i].visited = true;
                    setStops(stopsArrayCopy)
                    // TODO: this will be done differently if stored in BE
                }
            }
        }
    }

    function showLocationDetails(location) {
        setActiveStop(location);
        setDisplayStopInfo(true)
    }

    async function getUserCoordinates() {
        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
            const location = await getCurrentPositionAsync();
            setCoordinates({latitude: location.coords.latitude,
                longitude: location.coords.longitude})
        }else {
            //TODO - error message, "please go to settings and allow to share"
            setCoordinates({latitude: 48.85, longitude: 2.35})
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                {selectedRoute &&
                    <Header title={selectedRoute.name}/>
                }
                <View style={{marginBottom: 60, flex: 1, alignItems: 'center'}}>
                    {displayStopInfo && activeStop &&
                        <StopInfoDisplay stop={activeStop} closeDisplayFunction={()=>setDisplayStopInfo(false)}/>
                    }
                    {!displayStopInfo && coordinates &&
                        <View style={styles.mapContainer}>
                            <MapView style={styles.map} initialRegion={{
                                latitude: coordinates.latitude,
                                longitude:
                                coordinates.longitude,
                                latitudeDelta: 0.00922,
                                longitudeDelta: 0.00421,
                            }}
                                     region={{
                                         latitude: coordinates.latitude,
                                         longitude:
                                         coordinates.longitude,
                                         latitudeDelta: 0.00922,
                                         longitudeDelta: 0.00421,
                                     }}
                                     showsUserLocation={true}
                                     showsCompass={true}>
                                {selectedRoute.stops.map((marker, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                                        onCalloutPress={()=>showLocationDetails(marker)}
                                    >
                                        <Callout>
                                            <MapCalloutContent name={marker.name} description={marker.description}/>
                                        </Callout>
                                    </Marker>
                                ))}
                                <MapViewDirections
                                    origin={{latitude:selectedRoute.stops[0].latitude, longitude:selectedRoute.stops[0].longitude}}
                                    destination={{latitude:selectedRoute.stops[selectedRoute.stops.length-1].latitude, longitude:selectedRoute.stops[selectedRoute.stops.length-1].longitude}}
                                    mode="WALKING"
                                    apikey={GOOGLE_API_KEY}
                                    waypoints={waypointCoordinates}
                                />
                            </MapView>
                        </View>
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
