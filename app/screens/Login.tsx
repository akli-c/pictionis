import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { FIREBASE_AUTH } from '../../Firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RouterProps { 
  navigation: NavigationProp<any, any>
}



const Login = ({ navigation }: RouterProps ) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;

    useEffect(() => {
      const checkUser = async () => {
        const value = await AsyncStorage.getItem('user');
        if (value) {
          navigation.navigate('SessionTest');
        }
      };
      checkUser();
    }, []);

    // login
    const LogIn = async () => {
      setLoading(true);
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        
        const userName = response.user.email;
        alert(`Bienvenue, ${userName}`);
        
        // asyncStorage
        await AsyncStorage.setItem('user', JSON.stringify({ email: response.user.email}));
        
        // redirect session screen
        navigation.navigate('SessionTest', { user: userName });
      } catch (error) {
        alert('Échec de la connexion : ' + error);
      } finally {
        setLoading(false);
      }
    }

    // signup
    const SignUp = async () => {
      setLoading(true);
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        
        // displayName
        await updateProfile(response.user, { displayName: email.split('@')[0] });
        alert('Compte créé avec succès ! Veuillez vérifier vos emails.');
        
        // asyncStorage
        await AsyncStorage.setItem('user', JSON.stringify({ email: response.user.email }));
        
        // redirect
        navigation.navigate('SessionTest');
      } catch (error) {
        alert('Échec de l\'inscription : ' + error);
      } finally {
        setLoading(false);
      }
    }

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
          <TextInput 
            value={email} 
            style={styles.input} 
            placeholder='Email' 
            autoCapitalize='none' 
            onChangeText={(text) => setEmail(text)} 
          />
          <TextInput 
            secureTextEntry={true} 
            value={password} 
            style={styles.input} 
            placeholder='Password' 
            autoCapitalize='none' 
            onChangeText={(text) => setPassword(text)} 
          />
          { loading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={LogIn }>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={SignUp}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
    minWidth: '50%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});
