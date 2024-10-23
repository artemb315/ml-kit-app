import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { TextBlock } from "@react-native-ml-kit/text-recognition";

interface TextMapProps {
  blocks: TextBlock[];
}

const TextMap = ({ blocks }: TextMapProps) => {
  return (
    <View style={styles.container}>
      {!!blocks.length ? (
        blocks.map((block, blockId) => (
          <View key={blockId} style={{ marginVertical: 5 }}>
            {/* Touchable for the entire block */}
            <TouchableOpacity
              style={[styles.textBlock, styles.touchable]}
              onPress={() => Alert.alert("Block", block.text)}
            >
              <Text style={styles.text}>{block.text}</Text>
            </TouchableOpacity>

            {/* Touchable for each line and element */}
            {/* {block.lines.map((line, lineId) =>
              line.elements.map((element, elementId) => {
                const key = [blockId, lineId, elementId, element.text].join(
                  "-",
                );

                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.textElement, styles.touchable]}
                    onPress={() => Alert.alert("Element", element.text)}
                  >
                    <Text style={styles.text}>{element.text}</Text>
                  </TouchableOpacity>
                );
              }),
            )} */}
          </View>
        ))
      ) : (
        <Text style={styles.infoText}>
          No text detected. Please try another image.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  touchable: {
    marginBottom: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  textBlock: {
    backgroundColor: "rgba(27, 114, 232, 0.15)",
    padding: 8,
    borderRadius: 6,
  },
  textElement: {
    backgroundColor: "rgba(27, 114, 232, 0.25)",
    padding: 4,
    marginVertical: 2,
    marginLeft: 10,
    borderRadius: 4,
  },
  text: {
    color: "#1B72E8",
    fontSize: 14,
  },
  infoText: {
    fontSize: 16,
    color: "#6B7280", // A subtle gray color for informative text
    textAlign: "center",
    marginTop: 10,
  },
});

export default TextMap;
