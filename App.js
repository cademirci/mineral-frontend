import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Button, Image, TouchableOpacity, TextInput } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RadioButton } from 'react-native-paper';
import {
  azuriteProperties,
  baryteProperties,
  berylProperties,
  calciteProperties,
  cerussiteProperties,
  copperProperties,
  hematiteProperties,
  malachiteProperties,
  pyriteProperties,
  pyromorphiteProperties,
  quartzProperties,
  wulfeniteProperties
} from './minprop'

function HomeScreen({ navigation }) {
  let isLogin = false 
  
  if (!isLogin) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Welcome to Mineral App. Try to take a picture of a mineral to identify.
        </Text>
        <TouchableOpacity
          style={styles.defaultButton}
          title="take a picture"
          onPress={() => navigation.navigate('PhotoScreen')}
        >
          <Text style={styles.defaultText}>
            Take a Picture
          </Text>
        </ TouchableOpacity>
        <TouchableOpacity
          style={styles.alterButton}
          title="login"
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.defaultText}>
            Login
          </Text>
        </ TouchableOpacity>
        <TouchableOpacity
          style={styles.alterButton}
          title="sign up"
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.defaultText}>
            Sign Up
          </Text>
        </ TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.container}>
        <Text style={styles.paragraph}>
          Welcome to Mineral App. Try to take a picture of a mineral to identify.
        </Text>
        <TouchableOpacity
          style={styles.defaultButton}
          title="take a picture"
          onPress={() => navigation.navigate('PhotoScreen')}
        >
          <Text style={styles.defaultText}>
            Take a Picture
          </Text>
        </ TouchableOpacity>
        <Text style={styles.paragraph}>
          You are successfully logged in
        </Text>
      </View>
  )
}

function SignUp({ navigation }) {
  const [text, onChangeText] = useState('');
  const [number, onChangeNumber] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="username"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="mail address"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="password"
        // keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.defaultButton}
        title="register"
        // galeriye gonderme 
        onPress={() => navigation.navigate('')}
      >
        <Text style={styles.defaultText}>
          Sign Up
        </Text>
      </ TouchableOpacity>
    </SafeAreaView>
  )
}

function Login({ navigation }) {
  const [text, onChangeText] = useState('');
  const [number, onChangeNumber] = useState(''); 

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="username"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="password"
        // keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.defaultButton}
        title="register"
        onPress={() => navigation.navigate('')}
      >
        <Text style={styles.defaultText}>
          Login
        </Text>
      </ TouchableOpacity>
    </SafeAreaView>
  )
}

function PhotoScreen({ navigation }) {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    console.log(newPhoto.uri);
    
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <TouchableOpacity 
          title="Share" 
          onPress={() => navigation.navigate('DetailedReport')}
          style={styles.defaultButton} 
        > 
          <Text style={styles.defaultText}>
            Analyze
          </Text>
        </ TouchableOpacity>
        <View style={styles.flexView}>
          <Button title="Share" onPress={sharePic} />
          {hasMediaLibraryPermission ? 
          <Button title="Save" onPress={savePhoto} /> : undefined}
          <Button title="Discard"  onPress={() => setPhoto(undefined)} />
        </View>
        
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
            title="takePicture" 
            onPress={takePic} 
            style={styles.takePicButton} 
          > 
          <Text style={styles.defaultText}>
            Take picture
          </Text>
        </ TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

function SeeTheResults({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        The analysis is completed. 
      </Text>
      <TouchableOpacity
        style={styles.defaultButton}
        title="seeTheRsults"
        onPress={() => navigation.navigate('DetailedReport')}
      >
        <Text style={styles.defaultText}>
          See the results
        </Text>
      </ TouchableOpacity>

    </View>
  )
}

function DetailedReport({ navigation }) {
  return (
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.mineraltitle}>
       Azurit
      </Text>
      <Text style={styles.infoParagraph}>
       detailed information about the mineral
      </Text>
      <TouchableOpacity
        style={styles.defaultButton}
        title="seeTheRsults"
        onPress={() => navigation.navigate('PoemScreen')}
      >
        <Text style={styles.defaultText}>
          Write a Poem or a Story
        </Text>
      </ TouchableOpacity>
    </ScrollView>
  )
}

function PoemScreen({ navigation }) {
  const [poemLines, setPoemLines] = useState('option1');
  const [genre, setGenre] = useState('');

  return (
    <View style={styles.container}>
      <Text>Poem or Story?</Text>
      <RadioButton.Group
        onValueChange={(value) => setGenre(value)}
        value={genre}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton value="option1" color="blue" />
          <Text>Poem</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton value="option2" color="blue" />
          <Text>Story</Text>
        </View>
      </RadioButton.Group>

      <Text>Select number of line in the poem</Text>
      <RadioButton.Group
        onValueChange={(value) => setPoemLines(value)}
        value={poemLines}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton value="option1" color="green" />
          <Text>4</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton value="option2" color="green" />
          <Text>5</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton value="option3" color="green" />
          <Text>6</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton value="option3" color="green" />
          <Text>7</Text>
        </View>
      </RadioButton.Group>
      {/* <Text>Selected Value: {poemLines}</Text> */}

      <TouchableOpacity
        style={styles.defaultButton}
        title="seeTheRsults"
        onPress={() => navigation.navigate('DisplayPoem')}
      >
        <Text style={styles.defaultText}>
          Write
        </Text>
      </ TouchableOpacity>
      
    </View>
  );
}

function DisplayPoem({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
       Azurit
      </Text>
      <Text style={styles.paragraph}>
       Azurit
      </Text>

    </View>
  )
}

function Fovourites({ navigation }) {
  return (
    <View style={styles.container}>


    </View>
  )
}

function History({ navigation }) {
  return (
    <View style={styles.container}>


    </View>
  )
}

function Feedback({ navigation }) {
  return (
    <View style={styles.container}>


    </View>
  )
}


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator initialRouteName="mineral">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="PhotoScreen" component={PhotoScreen} />
        <Stack.Screen name="DetailedReport" component={DetailedReport} />
        <Stack.Screen name="PoemScreen" component={PoemScreen} />
        <Stack.Screen name="SeeTheResults" component={SeeTheResults} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Feedback" component={Feedback} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: { 
    marginTop: 400,
  },
  defaultButton: {
    backgroundColor: '#2b6d74',
    maxWidth: '50%',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 20,
    borderRadius: 20,
  },
  alterButton: {
    backgroundColor: '#8b8b8b',
    maxWidth: '50%',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 20,
    borderRadius: 20,
  },
  takePicButton: {
    backgroundColor: '#2b6d74',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    marginBottom: 0
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  },
  defaultText: {
    color: '#fff',
    textAlign: 'center'
  },
  paragraph: {
    color: '#1a1a1a',
    textAlign: 'center',
    margin: 100
  },
  infoParagraph: {
    color: '#1a1a1a',
    margin: 25
  },
  mineraltitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10
  },
  flexView: {
    flexDirection: 'row'
  },
  input: {
    height: 40,
    minWidth: '75%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});
