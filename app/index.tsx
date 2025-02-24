import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        pointerEvents: "auto", // added pointerEvents in style
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Vamos a editar esta pantalla </Text>
    </View>
  );
}
