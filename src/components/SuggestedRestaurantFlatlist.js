import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

const SuggestedRestaurantFlatlist = ({ data }) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 19,
      }}
    >
      <FlatList
        data={data}
        numColumns={1}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                borderBottomColor: '#EBEBEB',
                borderBottomWidth: 1,
                padding: 13,
              }}
            >
              <Image
                source={item.img}
                style={{
                  width: 60,
                  height: 50,
                  borderRadius: 12,
                }}
              />
              <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                <Text style={styles.FlatListtitlestyle}>{item.title}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  <Feather name="star" size={17} color="#FF7622" />
                  <Text
                    style={{
                      fontFamily: 'Sen-Regular',
                      fontSize: 16,
                      marginLeft: 2,
                      color: '#181C2E',
                    }}
                  >
                    {item.ratings}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SuggestedRestaurantFlatlist;

const styles = StyleSheet.create({
  FlatListtitlestyle: {
    fontSize: 16,
    fontFamily: 'Sen-Regular',
    margin: 3,
    color: '#32343E',
    letterSpacing: -0.33,
  },
  Flatlistviewstyle: {
    justifyContent: 'center',
  },
});
