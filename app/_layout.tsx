import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";

const Layout = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
