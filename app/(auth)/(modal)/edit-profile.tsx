import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Colors } from "@/constants/Colors";

function Page() {
  const { bioString, linkString, userId, imageUrl } = useLocalSearchParams<{
    bioString: string;
    linkString: string;
    userId: string;
    imageUrl: string;
  }>();

  const [bio, setBio] = useState(bioString);
  const [link, setLink] = useState(linkString);

  const updateUser = useMutation(api.users.updateUser);
  const router = useRouter();

  async function onDone() {
    await updateUser({
      _id: userId as Id<"users">,
      bio,
      websiteUrl: link,
    });

    router.dismiss();
  }
  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={onDone}>
              <Text>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          placeholder="Tell us about yourself"
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={link}
          onChangeText={setLink}
          placeholder="https://example.com"
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    margin: 16,
    borderColor: Colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    padding: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bioInput: {
    height: 100,
  },
});

export default Page;
