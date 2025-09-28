import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image
} from 'react-native';


const PaymentCard = ({data}) => {
  return (
    <View
      style={{
        marginTop: 9,
      }}
    >
      <FlatList
        data={data}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View
              style={{
                borderWidth: 0.5,
                borderBlockColor: 'grey',
                width: 165,
                height: 80,
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 20,
                marginLeft: 9,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'black',
                    margin: 5,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'grey',
                    margin: 6,
                  }}
                >
                  {item.detail}
                </Text>
              </View>
              <View>
                <Image
                  source={item.img}
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PaymentCard;

const styles = StyleSheet.create({});
