import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import React from 'react';

const PopularFood = ( {data }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View style={styles.parentview}>
              <View style={{ zIndex: 1, top: 20 }}>
                <Image
                  source={item.img}
                  resizeMode="cover"
                  style={{ width: 130, height: 100, borderRadius: 15 }}
                />
              </View>
              <View style={styles.parenttext}>
                <Text style={styles.productname}>{item.title}</Text>
                <Text style={styles.restauranttext}>{item.restaurant}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PopularFood;

const styles = StyleSheet.create({
  container: { margin: 7 },
  parentview: {
    width: '100%',
    margin: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  parenttext: {
    alignItems: 'center',
    elevation: 9,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 25,
    padding: 10,
  },
  productname: {
    fontFamily: 'Sen-Bold',
    fontSize: 14,
    color: '#32343E',
  },
  restauranttext: {
    fontFamily: 'Sen-Regular',
    fontSize: 12,
    color: '#646982',
  },
});
