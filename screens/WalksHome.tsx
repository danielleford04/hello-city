import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Header from "@/components/Header";
import WalkListItem from "@/components/WalkListItem";
import {cbusWalk1, denverWalk1, denverWalk2} from "@/exampleWalks";
import {useEffect, useState} from "react";
import {getCurrentPositionAsync, requestForegroundPermissionsAsync} from "expo-location";
import { Coordinates, Walk } from "@/utilities/types";

const defaultWalks = [denverWalk1, cbusWalk1, denverWalk2]

interface WalksHomeProps {
    setSelectedWalk: (Walk)=>void;
}

export default function WalksHome({setSelectedWalk} : WalksHomeProps) {
    const [ coordinates, setCoordinates ] = useState<Coordinates | null>(null)
    const [walks, setWalks] = useState<Walk[] | null>(defaultWalks)

    useEffect(()=>{
        getUserCoordinates();
    },[])

    // TODO - when we have a backend, and the user comes to this component,
    // it will get user's coordinates, and then fetch walks based
    // on proximity to their current location
    async function getUserCoordinates() {
        const { status } = await requestForegroundPermissionsAsync();
        if (status === "granted") {
            const location = await getCurrentPositionAsync();
            setCoordinates({latitude: location.coords.latitude,
                longitude: location.coords.longitude})
        }else {
            //TODO - error message - can't use app without permissions to get location
            setCoordinates({latitude: 48.85, longitude: 2.35})
        }
    }

    return (
        <View>
            <Header title={"Hello City"} subtitle={"Self guided walking tours"} />
            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>Nearby</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>Saved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.walkListContainer}>
                {walks &&
                    walks.map((walk, index) => (
                        <WalkListItem walk={walk} onPress={setSelectedWalk} key={walk.id} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        justifyContent: 'space-around',
        height: 50,
        alignItems: 'center'
    },
    tabButton: {
        borderBottomWidth: 3,
        borderBottomColor: '#F4C542',
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabButtonText: {
        color: '#333333',
        fontFamily: "DMSansBold"
    },
    walkListContainer: {
        margin: 15
    }
});
