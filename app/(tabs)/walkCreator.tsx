import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Header from "@/components/Header";
import WalkCreatorHome from "@/screens/WalkCreatorHome";
import WalkCreatorMap from "@/screens/WalkCreatorMap";
import { Walk } from "@/utilities/types";

export default function TabTwoScreen() {
    const [displayWalkCreatorHome, setDisplayWalkCreatorHome] = useState<boolean>(true)
    const [activeWalk, setActiveWalk] = useState<Walk | null>(null)
    const [displayWalkCreatorMap, setDisplayWalkCreatorMap] = useState<boolean>(false)

    const openMapBuilderWithSelectedWalk=(walk)=> {
        setActiveWalk(walk)
        setDisplayWalkCreatorHome(false)
        setDisplayWalkCreatorMap(true)
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Header title="Walk Builder"/>
                {displayWalkCreatorHome &&
                    <WalkCreatorHome openMapBuilderWithSelectedWalk={openMapBuilderWithSelectedWalk}/>
                }
                {displayWalkCreatorMap &&
                    <WalkCreatorMap activeWalk={activeWalk}/>
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
