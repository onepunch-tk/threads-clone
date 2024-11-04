import { Button, Text, View } from "react-native";
import * as Sentry from "@sentry/react-native";

function Page() {
  function testError() {
    try {
      throw new Error("test error");
    } catch (e) {
      const sentryId = Sentry.captureMessage("Houston, we have a problem!");
      console.log("sentryId: ", sentryId);

      const userFeedback: Sentry.UserFeedback = {
        event_id: sentryId,
        name: "John Doe",
        email: "johndoe@example.com",
        comments: "This is a comment",
      };
      Sentry.captureUserFeedback(userFeedback);
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Feed</Text>
      <Button title="Create" onPress={testError} />
    </View>
  );
}

export default Page;
