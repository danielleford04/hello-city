import { StyleSheet, View, Text, Dimensions } from 'react-native';
import {requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import {useEffect, useState, useRef } from "react";
import MapView, {Callout, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import SimpleForm from "@/components/SimpleForm";

export default function TourBuilder({activeTour}) {
    const [initialCoordinates, setInitialCoordinates] = useState()
    const [stopsForTour, setStopsForTour] = useState([])
    const [newStopCoords, setNewStopCoords] = useState()
    const [displayNewStopDetailsForm, setDisplayNewStopDetailsForm] = useState(false)
    const [waypointCoordinates, setWaypointCoordinates] = useState([])
    const [mapHeight, setMapHeight] = useState(null)
    const mapRef = useRef(null);

    useEffect(()=>{
        if (activeTour.stops && activeTour.stops.length>0) {
            setStopsForTour(activeTour.stops)
            setInitialCoordinates({latitude: activeTour.stops[0].latitude, longitude: activeTour.stops[0].longitude})
        } else {
            getUserCoordinates();
        }
    },[])

    console.log('active tour', activeTour)
    console.log('stops for tour', stopsForTour)


    const handlePlaceSelect = (place) => {
        animateToNewRegion({latitude: place.details.location.latitude, longitude: place.details.location.longitude})
    };

    useEffect(()=>{
        const waypointCoords = [];
        for (let i=1; i<stopsForTour.length-1; i++) {
            waypointCoords.push({latitude: stopsForTour[i].latitude, longitude: stopsForTour[i].longitude})
        }
        setWaypointCoordinates(waypointCoords)
    },[stopsForTour])

    async function getUserCoordinates() {
        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
            const location = await getCurrentPositionAsync();
            setInitialCoordinates({latitude: location.coords.latitude,
                longitude: location.coords.longitude})
        }else {
            setInitialCoordinates({latitude: '48.85', longitude: '2.35'})
        }
    }

    const getMapDimensions = (layout) =>{
        const {height} = layout;
        setMapHeight(height)
    }

    function initiateCreateNewStop(e) {
        const coords = { latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude }
        setNewStopCoords(coords)
        setDisplayNewStopDetailsForm(true)
    }

    function addStopToRoute(formData) {
        setDisplayNewStopDetailsForm(false)
        setStopsForTour([...stopsForTour, { name: formData.name, desc: formData.description, latitude: newStopCoords.latitude, longitude: newStopCoords.longitude } ])
    }

    const animateToNewRegion = ( latLng) => {
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
           {!displayNewStopDetailsForm && initialCoordinates &&
                <View style={styles.mapContainer}>
                    <Text style={styles.listTitle}>{activeTour.name}</Text>
                    <Text style={{fontSize: 16, fontFamily: "Inter", color: '#333333', textAlign: "center", marginBottom: 10}}>To add a stop, long press the location</Text>
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
                            onLongPress={(e)=>initiateCreateNewStop(e)}
                        >
                            {stopsForTour.length>0 &&
                                stopsForTour.map((marker, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                                        // onCalloutPress={()=>showLocationDetails(marker)} - TODO - function to edit stop
                                    >
                                        <Callout>
                                            <View style={{alignItems: 'center', justifyContent: 'center',  width: 200}}>
                                                <Text style={{fontFamily: "DMSansBold"}}>{marker.name}</Text>
                                                <Text style={{fontFamily: "DMSans", overflow: 'hidden'}} numberOfLines={4} ellipsizeMode={"tail"}>{marker.description}</Text>
                                            </View>
                                        </Callout>
                                    </Marker>
                                ))}
                            {stopsForTour.length>1 &&
                                <MapViewDirections
                                    origin={{latitude: stopsForTour[0].latitude, longitude: stopsForTour[0].longitude}}
                                    destination={{
                                        latitude: stopsForTour[stopsForTour.length - 1].latitude,
                                        longitude: stopsForTour[stopsForTour.length - 1].longitude
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
            {displayNewStopDetailsForm &&
                <SimpleForm title={"Add a Stop"} onSubmit={addStopToRoute} onCancel={()=>setDisplayNewStopDetailsForm(false)}/>
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
});
