import {StyleSheet, View, Text, Dimensions } from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import {useEffect, useState} from "react";
import MapView, {Callout, Marker } from 'react-native-maps';
import Header from "@/components/Header";
import MapViewDirections from 'react-native-maps-directions';
import {areTwoLocationsWithin500Feet} from "@/utilities/utilities";
import WaypointDetailsCard from "@/components/WaypointDetailsCard";
import {Coordinates, Walk, Waypoint} from "@/utilities/types";
import MapCalloutContent from "@/components/MapCalloutContent";
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

interface WalkMapProps {
    selectedWalk: Walk;
}

export default function WalkMap({selectedWalk}:WalkMapProps) {
    const [coordinates, setCoordinates ] = useState<Coordinates|null>(null)
    const [activeWaypoint, setActiveWaypoint] = useState<Waypoint | null>(null)
    const [displayWaypointDetails, setDisplayWaypointDetails] = useState<boolean>(false)
    const [waypointCoordinates, setWaypointCoordinates] = useState<Coordinates[] | null>(null)
    const [waypoints, setWaypoints] = useState<Waypoint[]|null>(null);

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
        for (let i=1; i<selectedWalk.stops.length-2; i++) {
            waypointCoords.push({latitude: selectedWalk.stops[i].latitude, longitude: selectedWalk.stops[i].longitude})
        }
        setWaypointCoordinates(waypointCoords)
        setWaypoints(selectedWalk.stops)
    },[selectedWalk])

    function checkLocationProximityToNewStops() {
        if (waypoints && coordinates) {
            for (let i = 0; i < waypoints.length; i++) {
                if (areTwoLocationsWithin500Feet(coordinates, {
                    latitude: waypoints[i].latitude,
                    longitude: waypoints[i].longitude
                }) && waypoints[i].visited === false) {
                    showLocationDetails(waypoints[i])
                    const waypointsArrayCopy = waypoints;
                    waypointsArrayCopy[i].visited = true;
                    setWaypoints(waypointsArrayCopy)
                    // TODO: this will be done differently if stored in BE
                }
            }
        }
    }

    function showLocationDetails(location) {
        setActiveWaypoint(location);
        setDisplayWaypointDetails(true)
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
                {selectedWalk &&
                    <Header title={selectedWalk.name}/>
                }
                <View style={{marginBottom: 60, flex: 1, alignItems: 'center'}}>
                    {displayWaypointDetails && activeWaypoint &&
                        <WaypointDetailsCard waypoint={activeWaypoint} closeDisplayFunction={()=>setDisplayWaypointDetails(false)}/>
                    }
                    {!displayWaypointDetails && coordinates &&
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
                                {selectedWalk.waypoints.map((waypoint, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={{latitude: waypoint.latitude, longitude: waypoint.longitude}}
                                        onCalloutPress={()=>showLocationDetails(waypoint)}
                                    >
                                        <Callout>
                                            <MapCalloutContent name={waypoint.name} description={waypoint.description}/>
                                        </Callout>
                                    </Marker>
                                ))}
                                <MapViewDirections
                                    origin={{latitude:selectedWalk.waypoints[0].latitude, longitude:selectedWalk.waypoints[0].longitude}}
                                    destination={{latitude:selectedWalk.waypoints[selectedWalk.waypoints.length-1].latitude, longitude:selectedWalk.waypoints[selectedWalk.waypoints.length-1].longitude}}
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
