import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const CategoryCard = ({ data }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.Flatlistviewstyle}>
      <FlatList
        data={data}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('BurgerScreen', { category: item })
            }
          >
            <View style={styles.CategoriesFlatliststyle}>
              <Image
                source={{ uri: item.image }}
                style={styles.FlatListimagestyle}
              />
              <View>
                <Text style={styles.FlatListtitlestyle}>
                  {item.title || 'No Title'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  CategoriesFlatliststyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5FA',
    borderRadius: 39,
    marginVertical: 10,
    elevation: 9,
    margin: 6,
  },
  FlatListimagestyle: {
    width: 44,
    height: 44,
    borderRadius: 23,
    backgroundColor: '#ECF0F4',
    margin: 6,
  },
  FlatListtitlestyle: {
    fontSize: 14,
    fontFamily: 'Sen-Bold',
    margin: 3,
    color: '#32343E',
    flexShrink: 1,
  },
  Flatlistviewstyle: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
  },
});
