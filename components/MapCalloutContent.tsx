import {StyleSheet, Text, View} from 'react-native';

interface MapCalloutContentProps {
    name: string;
    description: string;
}

export default function MapCalloutContent({name, description} : MapCalloutContentProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.description} numberOfLines={4} ellipsizeMode={"tail"}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200
    },
    title: {
        fontFamily: "DMSansBold"
    },
    description: {
        fontFamily: "DMSans",
        overflow: 'hidden'
    }
});
