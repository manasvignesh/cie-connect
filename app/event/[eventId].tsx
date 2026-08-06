import { View, Text, ScrollView, Pressable, Image, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const EVENT_TYPE_LABELS: Record<string, string> = {
  hackathon: "Hackathon", workshop: "Workshop", tech_talk: "Tech Talk",
  coding_competition: "Coding Competition", research_seminar: "Research Seminar",
  career_fair: "Career Fair", internship_drive: "Internship Drive", startup_meetup: "Startup Meetup",
};

export default function EventDetailScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { events, rsvpEvent, cancelRsvp, spaces, users } = useStore();
  const colors = useColors();

  const event = events.find((e) => e.id === eventId);
  const space = event?.spaceId ? spaces.find((s) => s.id === event.spaceId) : null;
  const organizer = users.find((u) => u.id === event?.organizerId);

  if (!event) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>Event not found</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: colors.primary, fontSize: 14 }}>Go Back</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const handleRSVP = () => {
    if (event.isRegistered) {
      Alert.alert("Cancel Registration", "Are you sure you want to cancel?", [
        { text: "Keep Registered", style: "cancel" },
        { text: "Cancel", onPress: () => cancelRsvp(event.id) },
      ]);
    } else {
      rsvpEvent(event.id);
    }
  };

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
        <Text style={{ fontWeight: "600", fontSize: 16, color: colors.foreground }}>Event</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Poster */}
        {event.posterUrl && (
          <Image source={{ uri: event.posterUrl }} style={{ width: "100%", height: 200 }} resizeMode="cover" />
        )}

        {/* Content */}
        <View style={{ padding: 20 }}>
          {/* Type Badge */}
          <View style={{
            flexDirection: "row", alignItems: "center", marginBottom: 8,
          }}>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 4,
              borderRadius: 12, backgroundColor: colors.primary + "20",
            }}>
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600", textTransform: "uppercase" }}>
                {EVENT_TYPE_LABELS[event.type] || event.type}
              </Text>
            </View>
            {space && (
              <View style={{ marginLeft: 8, flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 14, marginRight: 4 }}>{space.logo}</Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>{space.name}</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={{ fontWeight: "bold", fontSize: 22, color: colors.foreground, lineHeight: 28 }}>{event.title}</Text>

          {/* Description */}
          <Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 22, marginTop: 12 }}>{event.description}</Text>

          {/* Details */}
          <View style={{ marginTop: 20, backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <IconSymbol name="calendar" size={20} color={colors.primary} />
              <Text style={{ color: colors.foreground, fontSize: 14, marginLeft: 10 }}>{event.date} at {event.time}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <IconSymbol name="building.2.fill" size={20} color={colors.primary} />
              <Text style={{ color: colors.foreground, fontSize: 14, marginLeft: 10 }}>{event.venue}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <IconSymbol name="person.fill" size={20} color={colors.primary} />
              <Text style={{ color: colors.foreground, fontSize: 14, marginLeft: 10 }}>
                {event.registeredCount} / {event.availableSeats + event.registeredCount} registered
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconSymbol name="flag.fill" size={20} color={colors.primary} />
              <Text style={{ color: colors.foreground, fontSize: 14, marginLeft: 10 }}>Organized by {event.organizer}</Text>
            </View>
          </View>

          {/* Technologies */}
          {event.technologies.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 15, marginBottom: 8 }}>Technologies</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {event.technologies.map((tech) => (
                  <View key={tech} style={{
                    paddingHorizontal: 10, paddingVertical: 4,
                    borderRadius: 12, backgroundColor: colors.accent + "15",
                  }}>
                    <Text style={{ color: colors.accent, fontSize: 12, fontWeight: "500" }}>{tech}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* RSVP Button */}
          <Pressable
            onPress={handleRSVP}
            style={({ pressed }) => ({
              marginTop: 24, paddingVertical: 14, borderRadius: 12,
              backgroundColor: event.isRegistered ? colors.error : colors.primary,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              {event.isRegistered ? "Cancel Registration" : "Register Now"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
