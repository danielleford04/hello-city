import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Tour} from "@/utilities/types";

interface RouteListItemProps {
    route: Tour;
    onPress: (Tour)=>void;
}

export default function RouteListItem({route, onPress} : RouteListItemProps) {
    return (
        <TouchableOpacity
           style={styles.container}
            onPress={()=>onPress(route)}
        >
            <Text style={styles.title}>
                {route.name}
            </Text>
            <Text style={styles.description}>
                {route.description}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        marginHorizontal: 5,
    },
    title: {
        fontWeight: "bold", fontSize: 20, fontFamily: "DMSansBold", marginBottom: 3, color: '#4A90E2'
},
    description: {
        fontSize: 16, fontFamily: "Inter", color: '#333333'
    }
});
