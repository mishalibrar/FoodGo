import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Pin, Star, User2Icon, Trash2, Pencil } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AddRestaurantModal from '../components/AddRestaurantModal';
import EditRestaurantModal from '../components/EditRestaurantModal';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const adminUid = route.params?.adminUid;
  const [restaurants, setRestaurants] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  useEffect(() => {
    if (!adminUid) return;

    const unsubscribe = firestore()
      .collection('admins')
      .doc(adminUid)
      .collection('restaurants')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(data);
      });
    return () => unsubscribe();
  }, [route.params?.adminUid]);

  const deleteRestaurant = restaurantId => {
    Alert.alert(
      'Delete Restaurant',
      'Are you sure you want to delete this restaurant?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('admins')
                .doc(adminUid)
                .collection('restaurants')
                .doc(restaurantId)
                .delete();
            } catch (error) {
              console.error('Error deleting restaurant: ', error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <User2Icon size={26} color="#181C2E" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
        <Text style={styles.subtitle}>Restaurants</Text>

        <FlatList
          data={restaurants}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('AdminRestaurantDetail', {
                  adminUid: adminUid,
                  restaurantId: item.id,
                })
              }
            >
              <View style={styles.card}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.restaurantImage}
                  />
                ) : null}

                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{item.name}</Text>
                  <Text style={styles.restaurantDetails}>{item.category}</Text>

                  <View style={styles.metaRow}>
                    <Star size={18} color="#FF7622" />
                    <Text style={styles.restaurantMeta}>{item.rating}</Text>

                    <View style={{ flexDirection: 'row', marginLeft: 16 }}>
                      <Pin size={18} color="#FF7622" />
                      <Text style={styles.restaurantMeta}>{item.location}</Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
                      onPress={() => {
                        setEditingRestaurant(item);
                        setEditModalVisible(true);
                      }}
                    >
                      <Pencil size={18} color="#fff" />
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#E53935' }]}
                      onPress={() => deleteRestaurant(item.id)}
                    >
                      <Trash2 size={18} color="#fff" />
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Pin size={40} color="#ccc" />
              <Text style={styles.emptyText}>No restaurants yet. Add one!</Text>
            </View>
          }
        />
      </View>

      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.floatingBtnText}>+</Text>
      </TouchableOpacity>

      <AddRestaurantModal
        isVisible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={() => setAddModalVisible(false)}
        adminUid={adminUid}
      />

      <EditRestaurantModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingRestaurant(null);
        }}
        onSave={() => {
          setEditModalVisible(false);
          setEditingRestaurant(null);
        }}
        adminUid={adminUid}
        restaurant={editingRestaurant}
      />
    </View>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F5FA',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { fontSize: 22, fontFamily: 'Sen-Bold', color: '#181C2E' },
  iconCircle: {
    backgroundColor: '#fff',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#181C2E',
    fontFamily: 'Sen-Bold',
  },

  card: {
    backgroundColor: '#F0F5FA',
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 160,
    margin: 0,
    borderRadius:10
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: { fontSize: 18, fontFamily: 'Sen-Bold', color: '#181C2E' },
  restaurantDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Sen-Medium',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  restaurantMeta: {
    fontSize: 13,
    color: '#777',
    fontFamily: 'Sen-Regular',
    marginLeft: 6,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-start',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
    fontFamily: 'Sen-Medium',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 12,
    fontSize: 15,
    fontFamily: 'Sen-Bold',
  },

  floatingBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF7622',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  floatingBtnText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 32,
  },
});
