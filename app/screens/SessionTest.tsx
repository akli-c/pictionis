import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { createSession, joinSession, useSession } from '../sessionService';
import { getAuth } from 'firebase/auth'; 
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/NavigationTypes';

const SessionTest = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
    const auth = getAuth();
    const currentUser = auth.currentUser; 
  
    const [userId, setUserId] = useState<string>(currentUser ? currentUser.uid : '');
    const [userName, setUserName] = useState<string>(currentUser ? currentUser.email || currentUser.email || 'Utilisateur' : ''); 
    const [sessionId, setSessionId] = useState<string>('');
    const sessionData = useSession(sessionId);
  
    useEffect(() => {
      if (currentUser) {
        setUserId(currentUser.uid);
        setUserName(currentUser.email || 'Utilisateur');
      }
    }, [currentUser]);
  

  const handleCreateSession = async () => {
    const newSessionId = await createSession(userId, userName);
    if (newSessionId) {
      setSessionId(newSessionId);
      console.log("Session créée avec succès:", newSessionId);
    }
  };

  const handleJoinSession = async () => {
    await joinSession(sessionId, userId, userName);
    navigation.navigate('Draw' , {sessionId});
    console.log("Session rejointe avec succès");
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button 
          title="Créer une Session" 
          onPress={handleCreateSession} 
        />
      </View>

      <TextInput
        placeholder="Entrer l'ID de la session"
        value={sessionId}
        onChangeText={setSessionId}
        style={styles.input}
      />

      <Pressable
        style={{
          alignSelf: "center",
          width: "50%",
          marginTop: 12,
          backgroundColor: "blue",
          padding: 10,
          borderRadius: 10,
          marginBottom: 10,
        }}
        onPress={handleJoinSession}
      >
        <Text style={{ color: "white", alignSelf: "center" }}>
          rejoindre la Session
        </Text>
      </Pressable>

      {sessionData ? (
        <View style={styles.participantsContainer}>
          <Text>Participants :</Text>
          {sessionData.participants && sessionData.participants.map((participant: any, index: number) => (
            <Text key={index} style={styles.participantText}>{participant.name}</Text>
          ))}
        </View>
      ) : (
        <Text style={styles.noSessionText}>Pas de session chargée</Text>
      )}
    </View>
  );
};

export default SessionTest;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    padding: 5,
  },
  participantsContainer: {
    marginTop: 20,
  },
  participantText: {
    fontSize: 16,
  },
  noSessionText: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});
