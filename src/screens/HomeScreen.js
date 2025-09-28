import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { ShoppingBag, User2Icon } from 'lucide-react-native';
import RestaurantCard from '../components/RestaurantCard';
import CategoryCard from '../components/CategoryCard';
import { useEffect, useState } from 'react';
import CustomModal from '../components/CustomModal';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    setShowModal(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth().currentUser;
      if (user) {
        const doc = await firestore().collection('users').doc(user.uid).get();
        if (doc.exists) setUserName(doc.data().name);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        const snapshot = await firestore().collectionGroup('restaurants').get();

        const data = snapshot.docs.map(doc => {
          const adminId = doc.ref.parent.parent.id;
          return {
            id: doc.id,
            adminId: adminId,
            ...doc.data(),
          };
        });

        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRestaurants();
  }, []);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const snapshot = await firestore().collectionGroup('categories').get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomModal visible={showModal} onClose={() => setShowModal(false)} />

      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <View style={styles.feathericon}>
              <Feather name="bar-chart-2" color="#181C2E" size={25} />
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', marginLeft: 6 }}>
            <Text style={styles.delivertextstyle}>DELIVER TO</Text>
            <Text style={styles.halalLabtext}>Halal Lab Office ▼</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            style={styles.profileicon}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <User2Icon size={26} color="#181C2E" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
            <View style={styles.lucideicon}>
              <ShoppingBag color="#ffffff" size={25} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
        <Text style={styles.Heyhalaltext}>Hey {userName || 'User'},</Text>
        <Text style={styles.goodafternoontext}> Good Afternoon!</Text>
      </View>

      <TouchableOpacity
        style={styles.textboxstyle}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="search" size={20} color="#A0A5BA" />
          <Text style={{ marginLeft: 10, color: '#676767' }}>
            Search dishes, restaurants
          </Text>
        </View>
      </TouchableOpacity>

      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.openrestaurantstext}>Open Restaurants</Text>
        </View>

        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Loading restaurants...
          </Text>
        ) : (
          <RestaurantCard data={restaurants} />
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feathericon: {
    backgroundColor: '#ECF0F4',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
    shadowColor: 'black',
    elevation: 7,
  },
  lucideicon: {
    backgroundColor: '#181C2E',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    // left: 95,
  },
  delivertextstyle: {
    padding: 4,
    fontFamily: 'Sen-Bold',
    fontSize: 12,
    color: '#FC6E2A',
  },
  halalLabtext: {
    color: '#676767',
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    paddingLeft: 5,
  },
  Heyhalaltext: {
    fontFamily: 'Sen-Medium',
    fontSize: 16,
    color: '#1E1D1D',
  },
  goodafternoontext: {
    fontFamily: 'Sen-Bold',
    fontSize: 16,
    color: '#1E1D1D',
  },
  textboxstyle: {
    fontSize: 14,
    fontFamily: 'Sen-Regular',
    color: '#676767',
    backgroundColor: '#F0F5FA',
    width: '90%',
    borderRadius: 10,
    flexDirection: 'row',
    margin: 15,
    padding: 15,
  },
  Categoriestextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 20,
    color: '#32343E',
    // marginTop: 10,
  },
  SeeAlltextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 16,
    color: '#333333',
    letterSpacing: -0.33,
    // position: 'absolute',
    // left: 125,
    // marginTop: 10,
  },
  openrestaurantstext: {
    fontFamily: 'Sen-Regular',
    fontSize: 20,
    color: '#32343E',
    marginTop: 10,
  },
  badgeiconstyle: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF7622',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileicon: {
    backgroundColor: '#ECF0F4',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    // transform: [{ rotate: '90deg' }],
    shadowColor: 'black',
    elevation: 7,
  },
});
