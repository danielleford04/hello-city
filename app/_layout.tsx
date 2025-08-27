import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import 'react-native-reanimated';


export default function RootLayout() {
  const [loaded] = useFonts({
    DMSans: require('../assets/fonts/DMSans-Regular.ttf'),
    DMSansBold: require('../assets/fonts/DMSans-Bold.ttf'),
    Inter: require('../assets/fonts/Inter_18pt-Regular.ttf')
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
        <>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </>
  );
}
