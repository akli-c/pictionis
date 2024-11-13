import React, { useState, useEffect } from "react";
import { Pressable, View, Text } from "react-native";
import { Canvas, Path, Skia, SkPath } from "@shopify/react-native-skia";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../Firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { RootStackParamList } from "../types/NavigationTypes";
import { RouteProp, useRoute } from "@react-navigation/native";
import { pushCanvas } from "../DrawService";

type DrawScreenRouteProp = RouteProp<RootStackParamList, 'Draw'>;


export default function DrawingCanvas() {
  const route = useRoute<DrawScreenRouteProp>();
  const sessionId: string = route.params.sessionId;
  const [paths, setPaths] = useState<SkPath[]>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);

  const handleTouchStart = (x: number, y: number) => {
    const newPath = Skia.Path.Make();
    newPath.moveTo(x, y);
    setCurrentPath(newPath);
  };

  const handleTouchMove = (x: number, y: number) => {
    if (currentPath) {
      currentPath.lineTo(x, y);
      const updatedPath = Skia.Path.MakeFromSVGString(
        currentPath.toSVGString()
      );
      if (updatedPath) {
        setCurrentPath(updatedPath);
      }
    }
  };

  const handleTouchEnd = () => {
    if (currentPath) {
      setPaths((prevPaths) => [...prevPaths, currentPath]);
      setCurrentPath(null);
      pushCanvas(sessionId, [currentPath]); 
    }
  };

  const clearCanvas = () => {
    paths.forEach((path) => {
      path.reset();
    });
    setPaths(paths.filter((path) => path.isEmpty()));
    setCurrentPath(null);
  };

  useEffect(() => {
    const drawingsRef = collection(db, "sessions", sessionId, "drawings");

    // Listener to get real-time updates for new drawings
    const unsubscribe = onSnapshot(query(drawingsRef, orderBy("timestamp")), (snapshot) => {
      const newDrawings = snapshot.docs.map((doc) => doc.data().drawings);
      const parsedPaths = newDrawings.flatMap((drawing) =>
        drawing.map((d: { points: string }) => Skia.Path.MakeFromSVGString(d.points))
      );

      setPaths(parsedPaths); // Set paths to include all real-time updates
    });

    return () => unsubscribe();
  }, [sessionId]);

  return (
    <View
      style={{ flex: 1 }}
      onTouchStart={(e) =>
        handleTouchStart(e.nativeEvent.locationX, e.nativeEvent.locationY)
      }
      onTouchMove={(e) =>
        handleTouchMove(e.nativeEvent.locationX, e.nativeEvent.locationY)
      }
      onTouchEnd={handleTouchEnd}
    >
      <Canvas style={{ flex: 1 }}>
        {paths.map((path, index) => (
          <Path
            key={index}
            path={path}
            color="black"
            style="stroke"
            strokeWidth={5}
          />
        ))}
        {currentPath && (
          <Path
            path={currentPath}
            color="black"
            style="stroke"
            strokeWidth={5}
          />
        )}
      </Canvas>
      <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 12 }}>
        <Pressable
          style={{
            alignSelf: "center",
            width: "25%",
            backgroundColor: "red",
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
          }}
          onPress={clearCanvas}
        >
          <Text style={{ color: "white", alignSelf: "center" }}>
            <FontAwesomeIcon icon={faTrashCan} />
          </Text>
        </Pressable>
      </View>
    </View>
  );
}