import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  useWindowDimensions,
  Switch,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const Editorscreen = ({
  setOpenEditor,
  notes,
  setNotes,
  darkMode,
  setDarkMode,
  selectedNote,
  setSelectedNote,
}) => {
  const { width, height } = useWindowDimensions();
  const [title, setTitle] = useState(selectedNote?.title || "");
  const [note, setNote] = useState(selectedNote?.note || "");

  const isLandscape = width > height;
  const isTablet = width >= 768;

  const bg = darkMode ? "#0f0f0f" : "#fafafa";
  const primary = darkMode ? "#ffffff" : "#0f0f0f";
  const muted = darkMode ? "#333" : "#eee";
  const placeholder = darkMode ? "#444" : "#bbb";
  const inputBg = darkMode ? "#1a1a1a" : "#ffffff";

  const saveNote = async () => {
    if (selectedNote) {
      const updated = notes.map((n) =>
        n.id === selectedNote.id ? { ...n, title, note } : n
      );
      setNotes(updated);
      await AsyncStorage.setItem("notes", JSON.stringify(updated));
    } else {
      const newNote = {
        id: Date.now().toString(),
        title,
        note,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      const updated = [newNote, ...notes];
      setNotes(updated);
      await AsyncStorage.setItem("notes", JSON.stringify(updated));
    }
    setSelectedNote(null);
    setOpenEditor(false);
  };

  const bodyStyle = StyleSheet.compose(styles.body, {
    paddingHorizontal: isTablet ? 48 : isLandscape ? 32 : 24,
  });

  const titleInputStyle = StyleSheet.compose(styles.titleInput, {
    fontSize: isTablet ? 32 : isLandscape ? 20 : 26,
    color: primary,
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { backgroundColor: bg }]}>

        {/* Hide banner in landscape to save space */}
        {!isLandscape && (
          <ImageBackground
            source={require("./bg.jpg")}
            style={styles.banner}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
            <View style={styles.topBar}>
              <Pressable onPress={() => setOpenEditor(false)} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </Pressable>
              <View style={styles.themeRow}>
                <Ionicons name={darkMode ? "moon" : "sunny"} size={16} color="#fff" />
                <Switch
                  value={darkMode}
                  onValueChange={() => setDarkMode(!darkMode)}
                  trackColor={{ false: "rgba(255,255,255,0.3)", true: "rgba(255,255,255,0.6)" }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="rgba(255,255,255,0.3)"
                />
              </View>
            </View>
          </ImageBackground>
        )}

        {/* Show compact header in landscape */}
        {isLandscape && (
          <View style={[styles.landscapeHeader, { borderBottomColor: muted }]}>
            <Pressable onPress={() => setOpenEditor(false)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={primary} />
            </Pressable>
            <View style={styles.themeRow}>
              <Ionicons name={darkMode ? "moon" : "sunny"} size={16} color={primary} />
              <Switch
                value={darkMode}
                onValueChange={() => setDarkMode(!darkMode)}
                trackColor={{ false: "#e0e0e0", true: "#333" }}
                thumbColor={darkMode ? "#ffffff" : "#0f0f0f"}
                ios_backgroundColor="#e0e0e0"
              />
            </View>
          </View>
        )}

        <View style={bodyStyle}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={titleInputStyle}
            placeholder="Title"
            placeholderTextColor={placeholder}
            selectionColor={primary}
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            style={[styles.noteInput, { color: primary, backgroundColor: inputBg }]}
            placeholder="Start writing..."
            placeholderTextColor={placeholder}
            multiline
            selectionColor={primary}
            textAlignVertical="top"
          />
        </View>

        <View style={[
          styles.bottomBar,
          {
            borderTopColor: muted,
            paddingHorizontal: isTablet ? 48 : isLandscape ? 32 : 24,
          }
        ]}>
          <View style={styles.charRow}>
            <Ionicons name="text-outline" size={13} color={placeholder} />
            <Text style={[styles.charCount, { color: placeholder }]}>
              {note.length} characters
            </Text>
          </View>
          <Pressable
            onPress={saveNote}
            style={[styles.saveBtn, { backgroundColor: primary }]}
          >
            <Ionicons name="checkmark" size={16} color={bg} />
            <Text style={[styles.saveBtnText, { color: bg }]}>Save</Text>
          </Pressable>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
};

export default Editorscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    height: 200,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 60,
  },
  landscapeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingTop: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backBtn: {
    padding: 4,
  },
  body: {
    flex: 1,
    paddingTop: 20,
  },
  titleInput: {
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 16,
    padding: 0,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    borderRadius: 12,
    padding: 16,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  charRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  charCount: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});