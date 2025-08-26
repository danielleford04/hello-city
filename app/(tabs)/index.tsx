import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState} from "react";
import ToursList from "@/screens/ToursList";
import TourMap from "@/screens/TourMap";
import {Tour} from "@/utilities/types";

export default function HomeScreen() {
    const [selectedRoute, setSelectedRoute] = useState<Tour | null>(null)

    const selectRoute = function(route) {
        setSelectedRoute(route)
    }

  return (
      <SafeAreaProvider>
          <SafeAreaView style={s.container}>
              {!selectedRoute &&
                  <ToursList setSelectedRoute={setSelectedRoute}/>
              }
              {selectedRoute &&
                  <TourMap selectedRoute={selectedRoute}/>
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
