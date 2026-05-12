import { Switch, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ToggleTheme = ({ darkMode, setDarkMode }) => {
  return (
    <View style={styles.row}>
      <Ionicons
        name={darkMode ? "moon" : "sunny"}
        size={16}
        color={darkMode ? "#ffffff" : "#0f0f0f"}
      />
      <Switch
        value={darkMode}
        onValueChange={() => setDarkMode(!darkMode)}
        trackColor={{ false: "#e0e0e0", true: "#333" }}
        thumbColor={darkMode ? "#ffffff" : "#0f0f0f"}
        ios_backgroundColor="#e0e0e0"
      />
    </View>
  );
};

export default ToggleTheme;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});