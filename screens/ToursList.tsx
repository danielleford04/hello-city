import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Header from "@/components/Header";
import RouteListItem from "@/components/RouteListItem";
import {cbusRoute1, denverRoute1, denverRoute2} from "@/sampleRoute";
import {useEffect, useState} from "react";
import {getCurrentPositionAsync, requestForegroundPermissionsAsync} from "expo-location";

const defaultRoutes = [denverRoute1, cbusRoute1, denverRoute2]

export default function ToursList({setSelectedRoute}) {
    const [ coordinates, setCoordinates ] = useState()
    const [routes, setRoutes] = useState(defaultRoutes)

    useEffect(()=>{
        getUserCoordinates();
    },[])

    // TODO - when we have a backend, and the user comes to this component,
    // it will get user's coordinates, and then fetch routes based
    // on proximity to their current location
    async function getUserCoordinates() {
        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
            const location = await getCurrentPositionAsync();
            setCoordinates({latitude: location.coords.latitude,
                longitude: location.coords.longitude})
        }else {
            //TODO - error message - can't use app without permissions to get location
            setCoordinates({latitude: '48.85', longitude: '2.35'})
        }
    }

    const selectRoute = function(route) {
        console.log("we've selected a route, time to go to the map", route)
    }

    return (
        <View>
            <Header title={"Hello City"} subtitle={"Self guided walking tours"} />
            <View style={{flexDirection: "row", justifyContent: 'space-around', height: 50, alignItems: 'center'}}>
                <TouchableOpacity style={{borderBottomWidth: 3, borderBottomColor: '#F4C542', flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: '#333333', fontFamily: "DMSansBold"}}>Nearby</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderBottomWidth: 1, borderBottomColor: 'lightgrey', flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: '#333333', fontFamily: "DMSansBold"}}>Saved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderBottomWidth: 1, borderBottomColor: 'lightgrey', flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: '#333333', fontFamily: "DMSansBold"}}>Search</Text>
                </TouchableOpacity>
            </View>
            <View style={{margin: 15}}>
                {routes.map((route, index) => (
                    <RouteListItem route={route} onPress={setSelectedRoute} key={route.id} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
});
