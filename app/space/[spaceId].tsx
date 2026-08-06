import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function SpaceDetailScreen() {
  const router = useRouter();
  const { spaceId } = useLocalSearchParams<{ spaceId: string }>();
  const { spaces, joinSpace, leaveSpace, events } = useStore();
  const colors = useColors();

  const space = spaces.find((s) => s.id === spaceId);
  const spaceEvents = space ? events.filter((e) => e.spaceId === spaceId) : [];

  if (!space) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>Space not found</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontSize: 14 }}>Go Back</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 10,
        borderBottomWidth: 0.5, borderBottomColor: colors.border,
      }}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <IconSymbol name="chevron.left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>{space.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Space Info */}
        <View style={{ alignItems: "center", paddingVertical: 24 }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: colors.primary + "20",
            alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ fontSize: 40 }}>{space.logo}</Text>
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 22, color: colors.foreground, marginTop: 12 }}>{space.name}</Text>
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "500", marginTop: 2 }}>{space.category}</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{space.memberCount} members</Text>
          <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 20, marginTop: 12, textAlign: "center", paddingHorizontal: 24 }}>
            {space.description}
          </Text>
        </View>

        {/* Join/Leave Button */}
        <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
          {space.isMember ? (
            <Pressable
              onPress={() => leaveSpace(space.id)}
              style={({ pressed }) => ({
                paddingVertical: 12, borderRadius: 12,
                backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
                alignItems: "center",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: colors.error, fontWeight: "600", fontSize: 15 }}>Leave Space</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => joinSpace(space.id)}
              style={({ pressed }) => ({
                paddingVertical: 12, borderRadius: 12,
                backgroundColor: colors.primary,
                alignItems: "center",
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Join Space</Text>
            </Pressable>
          )}
        </View>

        {/* Faculty Coordinator */}
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Faculty Coordinator</Text>
          <View style={{
            backgroundColor: colors.surface, borderRadius: 12, padding: 14,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <Text style={{ color: colors.foreground, fontSize: 14 }}>{space.facultyCoordinator}</Text>
          </View>
        </View>

        {/* Student Heads */}
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Student Heads</Text>
          <View style={{
            backgroundColor: colors.surface, borderRadius: 12, padding: 14,
            borderWidth: 1, borderColor: colors.border, flexDirection: "row", flexWrap: "wrap", gap: 6,
          }}>
            {space.studentHeads.map((head) => (
              <View key={head} style={{
                paddingHorizontal: 10, paddingVertical: 4,
                borderRadius: 12, backgroundColor: colors.primary + "15",
              }}>
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "500" }}>{head}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Learning Resources */}
        {space.learningResources.length > 0 && (
          <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Learning Resources</Text>
            <View style={{
              backgroundColor: colors.surface, borderRadius: 12, padding: 14,
              borderWidth: 1, borderColor: colors.border,
            }}>
              {space.learningResources.map((resource, i) => (
                <View key={resource} style={{
                  flexDirection: "row", alignItems: "center", paddingVertical: 6,
                  borderBottomWidth: i < space.learningResources.length - 1 ? 0.5 : 0,
                  borderBottomColor: colors.border,
                }}>
                  <IconSymbol name="book.fill" size={16} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontSize: 14, marginLeft: 8 }}>{resource}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Announcements */}
        {space.announcements.length > 0 && (
          <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Announcements</Text>
            {space.announcements.map((ann) => (
              <View key={ann.id} style={{
                backgroundColor: colors.surface, borderRadius: 12, padding: 14,
                borderWidth: 1, borderColor: colors.border, marginBottom: 8,
                borderLeftWidth: 3, borderLeftColor: ann.priority === "important" ? colors.warning : colors.primary,
              }}>
                <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 14 }}>{ann.title}</Text>
                <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4, lineHeight: 18 }}>{ann.content}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Events */}
        {spaceEvents.length > 0 && (
          <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Upcoming Events</Text>
            {spaceEvents.map((event) => (
              <Pressable
                key={event.id}
                onPress={() => router.push(`/event/${event.id}` as any)}
                style={({ pressed }) => ({
                  backgroundColor: colors.surface, borderRadius: 12, padding: 14,
                  borderWidth: 1, borderColor: colors.border, marginBottom: 8,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 14 }}>{event.title}</Text>
                <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{event.date} at {event.time}</Text>
                <Text style={{ color: colors.muted, fontSize: 13 }}>{event.venue}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Contact */}
        {space.contactInfo && (
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Contact</Text>
            <Text style={{ color: colors.primary, fontSize: 14 }}>{space.contactInfo}</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
