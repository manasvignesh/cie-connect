import { Stack } from "expo-router";
import { useStore } from "@/lib/store";
import { Redirect } from "expo-router";

export default function AuthLayout() {
  const { currentUser } = useStore();

  if (currentUser) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
