import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const ProductCard = ({ title, data }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          margin: 10,
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
        <TouchableOpacity>
          <Text>See All</Text>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View
                style={{
                  borderRadius: 12,
                  backgroundColor: 'white',
                  shadowColor: 'black',
                  padding: 5,
                  margin: 3,
                  marginInline: 4,
                  marginBottom: 15,
                }}
              >
                <View>
                  <Image
                    source={item.image}
                    style={{
                      width: 150,
                      height: 130,
                      borderRadius: 12,
                    }}
                    resizeMode='cover'
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      marginTop: 5,
                      maxWidth: 140,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                </View>
                <Text>⭐ {item.ratings}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>{item.price}</Text>
                  <Text
                    style={{
                      color: 'gray',
                    }}
                  >
                    {item.timeneededtomake}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default ProductCard;
