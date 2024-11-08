import {
  Alert,
  Image,
  InputAccessoryView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Id } from "@/convex/_generated/dataModel";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Colors } from "@/constants/Colors";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";

type ThreadComposerProps = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"messages">;
};

function ThreadComposer({ isPreview, isReply, threadId }: ThreadComposerProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);
  const { userProfile } = useUserProfile();
  const inputAccessoryViewID = "uniqueID";

  const addThread = useMutation(api.messages.addThreadMessages);

  async function handleSubmit() {
    await addThread({
      threadId,
      content,
    });

    handleRemoveThread();
    router.dismiss();
  }

  async function handleCancel() {
    handleRemoveThread();
    Alert.alert("Discard thread?", "", [
      {
        text: "Discard",
        onPress: () => router.dismiss(),
        style: "destructive",
      },
      {
        text: "Save Draft",
        style: "cancel",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  }

  function handleRemoveThread() {
    setContent("");
    setMediaFiles([]);
  }

  function selectImage(type: "library" | "camera") {
    if (type === "library") {
      // TODO
    } else if (type === "camera") {
      // TODO
    }
  }

  return (
    <View>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.topRow}>
        {userProfile?.imageUrl && (
          <Image
            source={{ uri: userProfile?.imageUrl }}
            style={styles.avatar}
          />
        )}
        <View style={styles.centerContainer}>
          <Text style={styles.name}>
            {userProfile?.first_name} {userProfile?.last_name}
          </Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            style={styles.inputContent}
            placeholder={isReply ? "Reply to thread" : "What's New?"}
            placeholderTextColor={Colors.border}
            multiline
            autoFocus={!isPreview}
            inputAccessoryViewID={inputAccessoryViewID}
          />
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("library")}
            >
              <Ionicons name="images-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("camera")}
            >
              <Ionicons name="camera-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="gif" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mic-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome6 name="hashtag" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="stats-chart-outline"
                size={24}
                color={Colors.border}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleRemoveThread}
          style={[styles.cancelButton, { opacity: isPreview ? 0 : 1 }]}
        >
          <Ionicons name="close" size={24} color={Colors.border} />
        </TouchableOpacity>
      </View>
      {Platform.OS === "ios" ? (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={styles.keyboardAccessoryView}>
            <Text style={styles.keyboardAccessoryText}>
              {isReply
                ? "Everyone can reply and quote"
                : " Profiles that you follow can reply and quote"}
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      ) : (
        // Android용 대체 UI
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.androidAccessoryView}>
            <Text style={styles.keyboardAccessoryText}>
              {isReply
                ? "Everyone can reply and quote"
                : " Profiles that you follow can reply and quote"}
            </Text>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignSelf: "flex-start",
  },
  centerContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContent: {
    fontSize: 16,
    maxHeight: 100,
  },
  iconRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  iconButton: {
    marginRight: 16,
  },
  cancelButton: {
    marginLeft: 12,
    alignSelf: "flex-start",
  },
  keyboardAccessoryView: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingLeft: 64,
    gap: 12,
  },
  keyboardAccessoryText: {
    flex: 1,
    color: Colors.border,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  androidAccessoryView: {},
});

export default ThreadComposer;
