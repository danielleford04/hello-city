import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Walk} from "@/utilities/types";

interface WalkListItemProps {
    walk: Walk;
    onPress: (Walk)=>void;
}

export default function WalkListItem({walk, onPress} : WalkListItemProps) {
    return (
        <TouchableOpacity
           style={styles.container}
            onPress={()=>onPress(walk)}
        >
            <Text style={styles.title}>
                {walk.name}
            </Text>
            <Text style={styles.description}>
                {walk.description}
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
