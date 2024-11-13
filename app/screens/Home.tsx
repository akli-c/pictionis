import React from 'react';
import { SafeAreaView } from 'react-native';
import DrawingCanvas from './Draw';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawingCanvas />
    </SafeAreaView>
  );
}