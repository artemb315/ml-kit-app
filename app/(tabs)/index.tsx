import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import TextRecognition, {
  TextRecognitionResult,
} from "@react-native-ml-kit/text-recognition";
import TextMap from "../../components/TextMap";

export default function HomeScreen() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [result, setResult] = useState<TextRecognitionResult>();
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Request Camera Permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  // Pick an image from the gallery and recognize text
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setBackgroundImage(imageUri);
      recognizeText(imageUri);
    }
  };

  // Capture an image using the camera and recognize text
  const captureImage = async () => {
    if (!cameraPermission) {
      Alert.alert(
        "Camera Permission Denied",
        "Please allow camera access to capture an image.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setBackgroundImage(imageUri);
      recognizeText(imageUri);
    }
  };

  // Recognize text in an image
  const recognizeText = async (imageUri: string) => {
    setLoading(true);
    try {
      const result = await TextRecognition.recognize(imageUri);
      setResult(result);
    } catch (error) {
      console.error("Error recognizing text: ", error);
      Alert.alert("Error", "Failed to recognize text in the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Text Recognition App</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Import from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={captureImage}>
          <Text style={styles.buttonText}>Capture Picture</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1B72E8" />
      ) : backgroundImage ? (
        <>
          <Image source={{ uri: backgroundImage }} style={styles.image} />
          <TextMap blocks={result?.blocks || []} />
        </>
      ) : (
        <Text style={styles.placeholderText}>
          No image selected. Import or capture an image to start.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1B72E8",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1B72E8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  image: {
    width: "90%",
    height: "20%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
  },
});
