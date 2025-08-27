import { StyleSheet, View, Text, Dimensions } from 'react-native';
import {requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import {useEffect, useState, useRef } from "react";
import MapView, {Callout, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import SimpleForm from "@/components/SimpleForm";
import {Coordinates, Walk, Waypoint} from "@/utilities/types";
import MapCalloutContent from "@/components/MapCalloutContent";

interface WalkCreatorMapProps {
    activeWalk: Walk;
}

export default function WalkCreatorMap({activeWalk} : WalkCreatorMapProps) {
    const [initialCoordinates, setInitialCoordinates] = useState<Coordinates|null>(null)
    const [waypoints, setWaypoints] = useState<Waypoint[]>([])
    const [newWaypointCoordinates, setNewWaypointCoordinates] = useState<Coordinates|null>(null)
    const [displayNewWaypointForm, setDisplayNewWaypointForm] = useState<boolean>(false)
    const [waypointCoordinates, setWaypointCoordinates] = useState<Coordinates[]>([])
    const [mapHeight, setMapHeight] = useState<number | null>(null)
    const mapRef = useRef(null);

    useEffect(()=>{
        if (activeWalk.waypoints && activeWalk.waypoints.length>0) {
            setWaypoints(activeWalk.waypoints)
            setInitialCoordinates({latitude: activeWalk.waypoints[0].latitude, longitude: activeWalk.waypoints[0].longitude})
        } else {
            getUserCoordinates();
        }
    },[])

    console.log('active walk', activeWalk)
    console.log('waypoints', waypoints)

    const handlePlaceSelect = (place) => {
        animateToNewRegion({latitude: place.details.location.latitude, longitude: place.details.location.longitude})
    };

    useEffect(()=>{
        const waypointCoords = [];
        for (let i=1; i<waypoints.length-1; i++) {
            waypointCoords.push({latitude: waypoints[i].latitude, longitude: waypoints[i].longitude})
        }
        setWaypointCoordinates(waypointCoords)
    },[waypoints])

    async function getUserCoordinates() {
        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
            const location = await getCurrentPositionAsync();
            setInitialCoordinates({latitude: location.coords.latitude,
                longitude: location.coords.longitude})
        }else {
            setInitialCoordinates({latitude: 48.85, longitude: 2.35})
        }
    }

    const getMapDimensions = (layout) =>{
        const {height} = layout;
        setMapHeight(height)
    }

    function initiateCreateNewWaypoint(e) {
        const coords = { latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude }
        setNewWaypointCoordinates(coords)
        setDisplayNewWaypointForm(true)
    }

    function addWaypointToWalk(formData: {name: string, description: string}) {
        if (newWaypointCoordinates) {
            setDisplayNewWaypointForm(false)
            setWaypoints([...waypoints, {
                name: formData.name,
                description: formData.description,
                id: 'randomId',
                latitude: newWaypointCoordinates.latitude,
                longitude: newWaypointCoordinates.longitude
            }])
        }
    }

    const animateToNewRegion = ( latLng : Coordinates) => {
        const newRegion = {
            latitude: latLng.latitude,
            longitude: latLng.longitude,
        };
        if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1500); // 1.5 seconds animation
        }
    };

    return (
       <>
           {!displayNewWaypointForm && initialCoordinates && mapHeight &&
                <View style={styles.mapContainer}>
                    <Text style={styles.listTitle}>{activeWalk.name}</Text>
                    <Text style={styles.instructionText}>To add a waypoint, long press the map</Text>
                    <GooglePlacesTextInput
                        fetchDetails={true}
                        apiKey={GOOGLE_API_KEY}
                        onPlaceSelect={handlePlaceSelect}
                    />
                    <View style={{flex:1}} onLayout={(event) => {getMapDimensions(event.nativeEvent.layout) }}
                    >
                        <MapView
                            ref={mapRef}
                            style={{width: Dimensions.get('window').width, height: mapHeight}}
                            initialRegion={{
                                latitude: initialCoordinates.latitude,
                                longitude:
                                initialCoordinates.longitude,
                                latitudeDelta: 0.00322,
                                longitudeDelta: 0.00121,
                            }}
                            onLongPress={(e)=>initiateCreateNewWaypoint(e)}
                        >
                            {waypoints.length>0 &&
                                waypoints.map((marker, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                                        // onCalloutPress={()=>showLocationDetails(marker)} - TODO - function to edit waypoint
                                    >
                                        <Callout>
                                            <MapCalloutContent name={marker.name} description={marker.description}/>
                                        </Callout>
                                    </Marker>
                                ))}
                            {waypoints.length>1 &&
                                <MapViewDirections
                                    origin={{latitude: waypoints[0].latitude, longitude: waypoints[0].longitude}}
                                    destination={{
                                        latitude: waypoints[waypoints.length - 1].latitude,
                                        longitude: waypoints[waypoints.length - 1].longitude
                                    }}
                                    mode="WALKING"
                                    apikey={GOOGLE_API_KEY}
                                    waypoints={waypointCoordinates}
                                />
                            }
                        </MapView>
                    </View>
                </View>
            }
            {displayNewWaypointForm &&
                <SimpleForm title={"Add Waypoint"} onSubmit={addWaypointToWalk} onCancel={()=>setDisplayNewWaypointForm(false)}/>
            }
       </>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
    },
    listTitle: {
        fontWeight: "bold",
        fontSize: 24,
        fontFamily: "DMSansBold",
        marginBottom: 3,
        color: '#333333',
        textAlign: 'center'
    },
    instructionText: {
        fontSize: 16,
        fontFamily: "Inter",
        color: '#333333',
        textAlign: "center",
        marginBottom: 10
    }
});
