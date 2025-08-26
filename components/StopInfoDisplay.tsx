import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import {Stop} from "@/utilities/types";

interface StopInfoDisplayProps {
    stop: Stop;
    closeDisplayFunction: ()=>void;
}

export default function StopInfoDisplay({stop, closeDisplayFunction}:StopInfoDisplayProps) {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center'}}>
                <Text style={{fontSize: 24, marginTop: 10, fontFamily: "DMSansBold"}}>You've arrived at:</Text>
                <Text style={styles.title}>{stop.name}</Text>
                {stop.img &&
                    <Image source={{uri: stop.img}}
                           width={300}
                           height={200}
                           contentFit="contain"/>
                }
                <Text style={styles.description}>
                    {stop.description}
                </Text>
                <TouchableOpacity
                    onPress={closeDisplayFunction}
                    style={styles.closeButton}>
                    <Text>Return to Map</Text>
                </TouchableOpacity>
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2, borderRadius: 5, alignContent: 'center', width: '95%',  flex: 1
},
    title: {
        fontSize: 32, fontWeight: 'bold', marginBottom: 10, marginHorizontal: 10, textAlign: 'center', fontFamily: "DMSansBold"
    },
    description: {
        margin: 10, fontFamily: "Inter", textAlign: 'center'
    },
    closeButton: {
        borderWidth: 2, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 15, marginTop: 10, marginBottom: 30
    }
});
