import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import skylineImage from '@/assets/images/skyline.jpg';

interface HeaderProps {
    header: string;
    subtitle?: string;
}

export default function Header({title, subtitle} : HeaderProps) {
    return (
        <View>
            <ImageBackground source={skylineImage} style={styles.imageBackground} imageStyle={{ opacity: .25}}>
                <Text style={styles.title}>{title}</Text>
                {subtitle &&
                <Text style={styles.subtitle}>{subtitle}</Text>}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        width: '100%',
        height: 125,
        justifyContent: 'center'
    },
    title: {
        fontSize: 40,
        fontFamily: "DMSansBold",
        textAlign: "center",
        color: '#333333',
    },
    subtitle: {
        fontFamily: "Inter",
        textAlign: "center",
        fontSize: 18,
        color: '#333333',
    }
});
