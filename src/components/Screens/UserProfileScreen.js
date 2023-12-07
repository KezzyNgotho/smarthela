import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image, Linking,TouchableOpacity} from 'react-native';
import { Card, Title,Avatar ,Paragraph,Button,List} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(auth().currentUser);
  const [editableFields, setEditableFields] = useState({
    fullName: '',
    email: user.email || '',
    mobileNumber: '', // Will be fetched from Firestore
    accountNumber: '', // Will be fetched from Firestore
  });

  useEffect(() => {
    // Fetch additional user information from Firestore
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(user.uid).get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setEditableFields({
            ...editableFields,
            fullName: userData.name || '',
            mobileNumber: userData.phone || '',
            accountNumber: userData.accountNumber || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data from Firestore:', error);
      }
    };

    fetchUserData();
  }, [user, editableFields]);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      setUser(null);
      navigation.navigate('Login'); // Navigate to the Login screen
    } catch (error) {
      console.error('Failed to log out. Please try again.', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(user.email);
      Alert.alert('Success', 'Password reset email sent. Check your inbox.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
      console.error('Failed to send password reset email. Please try again.', error);
    }
  };

  const handleEditProfile = () => {
    // Implement user profile editing functionality
    console.log('Navigate to the edit profile screen.');
  };

  const renderEditableField = (label, value, placeholder, key) => {
    return (
      <List.Item
        title={label}
        description={value || placeholder}
        onPress={() => handleEditField(key)}
        left={(props) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../assets/icons8-edit-30.png')} // Update with your own image source
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
          </View>
        )}
      />
    );
  };

  const handleEditField = (field) => {
    console.log(`Edit ${field}`);
    // Add your edit field logic here
  };

  const openWhatsApp = () => {
    // You can replace the phone number and message with your own details
    Linking.openURL(`https://wa.me/0716304517?text=Hello%20from%20your%20app`);
  };

  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/your_username/');
  };

  const openTwitter = () => {
    Linking.openURL('https://twitter.com/your_username/');
  };

  const makePhoneCall = () => {
    // You can replace the phone number with your own
    Linking.openURL('tel:+254716304517');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Avatar.Image size={120} source={require('../assets/icons8-user-48.png')} />
            <Title style={styles.username}>{editableFields.fullName}</Title>
            <Paragraph style={styles.email}>{editableFields.email}</Paragraph>
          </View>
          <Button mode="contained" style={styles.editProfileButton} onPress={() => handleEditProfile()}>
            Edit Profile
          </Button>
        </Card.Content>
      </Card>

      <List.Section style={styles.section}>
        {renderEditableField('Full Name', editableFields.fullName, 'Add Full Name', 'fullName')}
        {renderEditableField('Mobile Number', editableFields.mobileNumber, 'Add Mobile Number', 'mobileNumber')}
        {renderEditableField('Account Number', editableFields.accountNumber, 'Add Account Number', 'accountNumber')}
      </List.Section>

      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <List.Item
              title="Reset Password"
              onPress={() => handleResetPassword()}
              style={styles.option}
              left={(props) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('../assets/icons8-reset-24.png')} // Update with your own image source
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                </View>
              )}
            />
            <List.Item
              title="Logout"
              onPress={() => handleLogout()}
              style={styles.creativeOption}
              left={(props) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('../assets/icons8-logout-rounded-50.png')} // Update with your own image source
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                </View>
              )}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Support</Title>
          <View style={styles.supportIcons}>
            <TouchableOpacity onPress={openWhatsApp}>
              <Image source={require('../assets/icons8-whatsapp-30.png')} style={styles.supportImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openInstagram}>
              <Image source={require('../assets/icons8-instagram-48.png')} style={styles.supportImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openTwitter}>
              <Image source={require('../assets/icons8-twitterx-24.png')} style={styles.supportImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={makePhoneCall}>
              <Image source={require('../assets/icons8-call-30.png')} style={styles.supportImage} />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  editProfileButton: {
    marginVertical: 10,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  creativeOption: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  supportIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  supportImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default UserProfileScreen;
