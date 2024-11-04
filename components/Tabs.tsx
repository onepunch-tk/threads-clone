import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useState } from "react";

type TabsProps = {
  onTabChange: (tab: string) => void;
};

function Tabs({ onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState("Threads");
  function handleTabPress(tab: string) {
    setActiveTab(tab);
    onTabChange(tab);
  }
  return (
    <View style={styles.container}>
      {["Threads", "Replies", "Reposts"].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => handleTabPress(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  tab: {
    alignItems: "center",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 12,
  },
  tabText: {
    color: Colors.border,
  },
  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },

  activeTab: {
    borderBottomColor: "black",
  },
});

export default Tabs;
