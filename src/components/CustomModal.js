import { Image, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CustomModal = ({ visible, onClose }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{
        width: 315,
        height: 395,
        position: 'absolute',
        left: 5,
        top: 150,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <LinearGradient
          colors={['#FFEB34', '#E76F00']}
          style={{
            borderRadius: 35,
            flex: 1,
          }}
          start={{ x: -0.5, y: -0.5 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={{
              position: 'absolute',
              borderRadius: 75,
              backgroundColor: '#FFE194',
              width: 45,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              left: 265,
              bottom: 370,
              elevation: 8,
              shadowColor: 'black',
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color="#EF761A" />
            </TouchableOpacity>
          </View>

          <Image
            source={require('../assets/images/elements.png')}
            style={{
              width: 270,
              height: 190.32,
              alignSelf: 'center',
              position: 'absolute',
              top: 39,
            }}
          />
          <Text
            style={{
              fontFamily: 'Sen-ExtraBold',
              fontSize: 41,
              color: '#FFFFFF',
              textAlign: 'center',
              // bottom: 34,
              lineHeight: 56,
              top: 75,
            }}
          >
            Hurry Offers!
          </Text>
          <Text
            style={{
              fontFamily: 'Sen-Bold',
              fontSize: 30,
              color: '#FFFFFF',
              textAlign: 'center',
              lineHeight: 56,
              top: 109,
            }}
          >
            #1243CD2
          </Text>
          <Text
            style={{
              fontFamily: 'Sen-Bold',
              fontSize: 18,
              color: '#FFFFFF',
              textAlign: 'center',
              lineHeight: 56,
              top: 110,
            }}
          >
            Use the cupon get 25% discount
          </Text>
          <TouchableOpacity onPress={onClose}>
            <View
              style={{
                borderColor: 'white',
                backgroundColor: 'transparent',
                borderWidth: 2,
                width: 279,
                height: 62,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 16,
                top: 120,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Sen-Bold',
                  fontSize: 16,
                  color: 'white',
                }}
              >
                Got it
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default CustomModal;
