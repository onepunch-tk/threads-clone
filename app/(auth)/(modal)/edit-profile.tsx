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
import * as ImagePicker from "expo-image-picker";

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
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const router = useRouter();
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  async function onDone() {
    let storageId: Id<"_storage"> | undefined;
    if (selectedImage) {
      storageId = await updateProfilePicture();
    }

    await updateUser({
      _id: userId as Id<"users">,
      bio,
      websiteUrl: link,
      ...(storageId && { imageUrl: storageId }),
    });

    router.dismiss();
  }

  async function updateProfilePicture() {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(selectedImage!.uri);
    const blob = await response.blob();
    const result = await fetch(uploadUrl, {
      method: "POST",
      body: blob,
      headers: { "Content-Type": selectedImage!.mimeType! },
    });
    const { storageId } = await result.json();
    console.log("storageId: ", storageId);
    return storageId as Id<"_storage">;
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
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
      <TouchableOpacity onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </TouchableOpacity>

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
