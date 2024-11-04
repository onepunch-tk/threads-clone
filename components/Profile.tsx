import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import UserProfile from "@/components/UserProfile";
import Tabs from "@/components/Tabs";

type ProfileProps = {
  userId?: Id<"users">;
  showBackButton?: boolean;
};

function Profile({ userId, showBackButton = false }: ProfileProps) {
  const { userProfile } = useUserProfile();
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={[]}
        renderItem={() => <Text>Test</Text>}
        ListEmptyComponent={
          <Text style={styles.tabContentText}>
            You haven't posted anything yet.
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons name={"chevron-back"} size={24} color={"black"} />
                  <Text>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name={"web"} size={24} />
              )}
              <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons name={"logo-instagram"} size={24} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons
                    name={"log-out-outline"}
                    size={24}
                    color={"black"}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {userId && <UserProfile userId={userId} />}
            {!userId && userProfile?._id && (
              <UserProfile userId={userProfile?._id} />
            )}

            <Tabs onTabChange={() => console.log("tab change")} />
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tabContentText: {
    fontSize: 17,
    color: Colors.border,
    textAlign: "center",
    marginVertical: 16,
  },
});

export default Profile;
