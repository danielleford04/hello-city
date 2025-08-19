import {StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import { useState } from "react";
import Header from "@/components/Header";
import TourBuilderHome from "@/screens/TourBuilderHome";
import TourBuilder from "@/screens/TourBuilder";

export default function TabTwoScreen() {
    const [displayTourBuilderHome, setDisplayTourBuilderHome] = useState(true)
    const [activeTour, setActiveTour] = useState(null)
    const [displayMapBuilder, setDisplayMapBuilder] = useState(false)

    const openMapBuilderWithSelectedTour=(tour)=> {
        setActiveTour(tour)
        setDisplayTourBuilderHome(false)
        setDisplayMapBuilder(true)
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Header title="Tour Builder"/>
                {displayTourBuilderHome &&
                    <TourBuilderHome openMapBuilderWithSelectedTour={openMapBuilderWithSelectedTour}/>
                }
                {displayMapBuilder &&
                    <TourBuilder activeTour={activeTour}/>
                }
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF9F6",
    },
});
