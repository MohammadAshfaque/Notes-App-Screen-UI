import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Switch,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import Editorscreen from "./Editorscreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const systemScheme = useColorScheme();
  const { width, height } = useWindowDimensions();
  const [darkMode, setDarkMode] = useState(systemScheme === "dark");
  const [openEditor, setOpenEditor] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [search, setSearch] = useState("");

  const isLandscape = width > height;
  const isTablet = width >= 768;

  const deleteNote = async (id) => {
    const updated = notes.filter((note) => note.id !== id);
    setNotes(updated);
    await AsyncStorage.setItem("notes", JSON.stringify(updated));
  };

  useEffect(() => {
    const loadNotes = async () => {
      const saved = await AsyncStorage.getItem("notes");
      if (saved) setNotes(JSON.parse(saved));
    };
    loadNotes();
  }, []);

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.note.toLowerCase().includes(search.toLowerCase()),
  );

  const bg = darkMode ? "#0f0f0f" : "#fafafa";
  const card = darkMode ? "#1a1a1a" : "#ffffff";
  const primary = darkMode ? "#ffffff" : "#0f0f0f";
  const muted = darkMode ? "#555" : "#bbb";
  const sub = darkMode ? "#888" : "#999";
  const searchBg = darkMode ? "#1a1a1a" : "#f0f0f0";

  const cardStyle = StyleSheet.flatten([
    styles.card,
    {
      backgroundColor: card,
      shadowColor: primary,
      padding: isTablet ? 20 : 16,
    },
  ]);

  return (
    <View style={{ flex: 1 }}>
      {openEditor ? (
        <Editorscreen
          setOpenEditor={setOpenEditor}
          notes={notes}
          setNotes={setNotes}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
        />
      ) : (
        <View
          style={[
            styles.container,
            {
              backgroundColor: bg,
              paddingTop: isLandscape ? 24 : 70, 
              paddingHorizontal: isTablet ? 40 : 24,
            },
          ]}
        >
          <StatusBar style={darkMode ? "light" : "dark"} />

          <View style={styles.header}>
            <Text
              style={[
                styles.heading,
                {
                  color: primary,
                  fontSize: isTablet ? 42 : isLandscape ? 26 : 36, 
                },
              ]}
            >
              Notes
            </Text>
            <View style={styles.themeRow}>
              <Ionicons
                name={darkMode ? "moon" : "sunny"}
                size={16}
                color={primary}
              />
              <Switch
                value={darkMode}
                onValueChange={() => setDarkMode(!darkMode)}
                trackColor={{ false: "#e0e0e0", true: "#333" }}
                thumbColor={darkMode ? "#ffffff" : "#0f0f0f"}
                ios_backgroundColor="#e0e0e0"
              />
            </View>
          </View>

          <Text style={[styles.count, { color: sub }]}>
            {filtered.length} {filtered.length === 1 ? "note" : "notes"}
          </Text>

          <View style={[styles.searchBox, { backgroundColor: searchBg }]}>
            <Ionicons name="search-outline" size={16} color={sub} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search notes..."
              placeholderTextColor={sub}
              style={[styles.searchInput, { color: primary }]}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color={sub} />
              </Pressable>
            )}
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            numColumns={isTablet || isLandscape ? 2 : 1} 
            key={isTablet || isLandscape ? "wide" : "narrow"}
            columnWrapperStyle={isTablet || isLandscape ? { gap: 12 } : null}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedNote(item);
                  setOpenEditor(true);
                }}
                style={({ pressed }) => [
                  cardStyle,
                  {
                    opacity: pressed ? 0.85 : 1,
                    flex: isTablet || isLandscape ? 1 : undefined,
                  },
                ]}
              >
                <Text
                  style={[styles.cardTitle, { color: primary }]}
                  numberOfLines={1}
                >
                  {item.title || "Untitled"}
                </Text>
                <Text
                  style={[styles.cardPreview, { color: sub }]}
                  numberOfLines={2}
                >
                  {item.note || "No content"}
                </Text>
                <View style={[styles.cardFooter, { borderTopColor: muted }]}>
                  <View style={styles.dateRow}>
                    <Ionicons name="time-outline" size={11} color={muted} />
                    <Text style={[styles.cardDate, { color: muted }]}>
                      {item.date} · {item.time}
                    </Text>
                  </View>
                  <View style={styles.cardActions}>
                    <Pressable
                      onPress={() => {
                        setSelectedNote(item);
                        setOpenEditor(true);
                      }}
                      style={styles.actionBtn}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={15}
                        color={primary}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => deleteNote(item.id)}
                      style={styles.actionBtn}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={15}
                        color="#e05252"
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons
                  name="document-text-outline"
                  size={48}
                  color={muted}
                />
                <Text style={[styles.emptyText, { color: muted }]}>
                  No notes yet
                </Text>
                <Text style={[styles.emptySub, { color: muted }]}>
                  Tap + to create one
                </Text>
              </View>
            }
          />

          <Pressable
            onPress={() => {
              setSelectedNote(null);
              setOpenEditor(true);
            }}
            style={[styles.fab, { backgroundColor: primary }]}
          >
            <Ionicons name="add" size={28} color={bg} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heading: {
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  count: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  card: {
    borderRadius: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  cardPreview: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardDate: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  empty: {
    alignItems: "center",
    marginTop: 100,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
