import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState} from "react";
import WalksHome from "@/screens/WalksHome";
import WalkMap from "@/screens/WalkMap";
import { Walk } from "@/utilities/types";

export default function HomeScreen() {
    const [selectedWalk, setSelectedWalk] = useState<Walk | null>(null)

  return (
      <SafeAreaProvider>
          <SafeAreaView style={s.container}>
              {!selectedWalk &&
                  <WalksHome setSelectedWalk={setSelectedWalk}/>
              }
              {selectedWalk &&
                  <WalkMap selectedWalk={selectedWalk}/>
          }
        </SafeAreaView>
      </SafeAreaProvider>
  );
}

export const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF9F6",
    },
});
