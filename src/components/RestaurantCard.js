import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pin, Star } from 'lucide-react-native';

const RestaurantCard = ({ data }) => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={data}
      numColumns={1}
      scrollEnabled={false}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('RestaurantDetailScreen', {
              restaurant: item,
            })
          }
        >
          <View style={styles.container}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  alignItems: 'center',
                }}
              >
                <View style={styles.ratingRow}>
                  <Star size={15} color="#FF7622" />
                  <Text style={styles.rating}>{item.rating || 'N/A'}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 16 }}>
                  <Pin size={15} color="#FF7622" />
                  <Text style={styles.rating}>{item.location}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#F0F5FA',
    padding: 5,
    margin: 10,
    borderRadius: 20,
    paddingVertical: 13,
    elevation: 5,
    shadowRadius: 20,
  },
  image: {
    width: 328,
    height: 145,
    borderRadius: 15,
    backgroundColor: '#98A8B8',
  },
  name: {
    fontFamily: 'Sen-Bold',
    fontSize: 20,
    color: '#181C2E',
    marginTop: 9,
  },
  category: {
    fontFamily: 'Sen-Medium',
    fontSize: 14,
    color: '#A0A5BA',
    marginTop: 3,
  },
  ratingRow: {
    flexDirection: 'row',
  },
  rating: {
    fontFamily: 'Sen-Regular',
    fontSize: 12,
    marginLeft: 6,
  },
});
