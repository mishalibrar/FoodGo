import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Button from './Button';
import AntDesign from 'react-native-vector-icons/AntDesign';

const FilterModal = ({ modalVisible, setModalVisible }) => {
  const [selectedOffer, setSelectedOffer] = useState('Delivery');
  const [selectedTime, setSelectedTime] = useState('10-15 min');
  const [selectedPrice, setSelectedPrice] = useState('$$');
  const [selectedRating, setSelectedRating] = useState(4);

  return (
    <Modal
      isVisible={modalVisible}
      animationIn='slideInLeft'
      animationOut='slideOutRight'
      onBackdropPress={() => setModalVisible(false)}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'space-between' }}>
          <Text style={styles.heading}>Filter your search</Text>
          <View
            style={{
              borderRadius: 75,
              backgroundColor: '#ECF0F4',
              width: 45,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              // elevation: 8,
              shadowColor: 'black',
            }}
          >
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AntDesign name="close" size={20} color="#464E57" />
            </TouchableOpacity>
          </View>
        </View>
        {/* OFFERS */}
        <Text style={styles.label}>OFFERS</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOffer === 'Delivery' && styles.selectedButton,
            ]}
            onPress={() => setSelectedOffer('Delivery')}
          >
            <Text
              style={[
                styles.optionText,
                selectedOffer === 'Delivery' && styles.selectedText,
              ]}
            >
              Delivery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOffer === 'Pick Up' && styles.selectedButton,
            ]}
            onPress={() => setSelectedOffer('Pick Up')}
          >
            <Text
              style={[
                styles.optionText,
                selectedOffer === 'Pick Up' && styles.selectedText,
              ]}
            >
              Pick Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOffer === 'Offer' && styles.selectedButton,
            ]}
            onPress={() => setSelectedOffer('Offer')}
          >
            <Text
              style={[
                styles.optionText,
                selectedOffer === 'Offer' && styles.selectedText,
              ]}
            >
              Offer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOffer === 'Online payment available' &&
                styles.selectedButton,
            ]}
            onPress={() => setSelectedOffer('Online payment available')}
          >
            <Text
              style={[
                styles.optionText,
                selectedOffer === 'Online payment available' &&
                  styles.selectedText,
              ]}
            >
              Online payment available
            </Text>
          </TouchableOpacity>
        </View>

        {/* Deliver Time */}
        <Text style={styles.label}>DELIVER TIME</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedTime === '10-15 min' && styles.selectedButton,
            ]}
            onPress={() => setSelectedTime('10-15 min')}
          >
            <Text
              style={[
                styles.optionText,
                selectedTime === '10-15 min' && styles.selectedText,
              ]}
            >
              10-15 min
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedTime === '20 min' && styles.selectedButton,
            ]}
            onPress={() => setSelectedTime('20 min')}
          >
            <Text
              style={[
                styles.optionText,
                selectedTime === '20 min' && styles.selectedText,
              ]}
            >
              20 min
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedTime === '30 min' && styles.selectedButton,
            ]}
            onPress={() => setSelectedTime('30 min')}
          >
            <Text
              style={[
                styles.optionText,
                selectedTime === '30 min' && styles.selectedText,
              ]}
            >
              30 min
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pricing */}
        <Text style={styles.label}>PRICING</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[
              styles.circleButton,
              selectedPrice === '$' && styles.selectedCircleButton,
            ]}
            onPress={() => setSelectedPrice('$')}
          >
            <Text
              style={[
                styles.optionText,
                selectedPrice === '$' && styles.selectedText,
              ]}
            >
              $
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.circleButton,
              selectedPrice === '$$' && styles.selectedCircleButton,
            ]}
            onPress={() => setSelectedPrice('$$')}
          >
            <Text
              style={[
                styles.optionText,
                selectedPrice === '$$' && styles.selectedText,
              ]}
            >
              $$
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.circleButton,
              selectedPrice === '$$$' && styles.selectedCircleButton,
            ]}
            onPress={() => setSelectedPrice('$$$')}
          >
            <Text
              style={[
                styles.optionText,
                selectedPrice === '$$$' && styles.selectedText,
              ]}
            >
              $$$
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ratings */}
        <Text style={styles.label}>RATING</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[
              styles.circleButton,
              selectedRating === 1 && styles.selectedCircleButton,
            ]}
            onPress={() => setSelectedRating(1)}
          >
            <Text
              style={[
                styles.optionText,
                selectedRating === 1 && styles.selectedText,
              ]}
            >
              ⭐
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.circleButton,
              selectedRating === 2 && styles.selectedCircleButton,
            ]}
            onPress={() => setSelectedRating(2)}
          >
            <Text
              style={[
                styles.optionText,
                selectedRating === 2 && styles.selectedText,
              ]}
            >
              ⭐
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.circleButton,
              selectedRating === 3 && styles.selectedCircleButton,
            ]}
            onPress={() => setSelectedRating(3)}
          >
            <Text
              style={[
                styles.optionText,
                selectedRating === 3 && styles.selectedText,
              ]}
            >
              ⭐
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.circleButton,
              selectedRating === 4 && styles.selectedCircleButton,
            ]}
            onPress={() => setSelectedRating(4)}
          >
            <Text
              style={[
                styles.optionText,
                selectedRating === 4 && styles.selectedText,
              ]}
            >
              ⭐
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.circleButton,
              selectedRating === 5 && styles.selectedCircleButton,
            ]}
            onPress={() => setSelectedRating(5)}
          >
            <Text
              style={[
                styles.optionText,
                selectedRating === 5 && styles.selectedText,
              ]}
            >
              ⭐
            </Text>
          </TouchableOpacity>
        </View>
        {/* Filter Button */}
        <Button title={'FILTER'} />
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    width: '95%',
    borderRadius: 15,
    padding: 20,
  },
  heading: {
    fontSize: 17,
    marginBottom: 10,
    fontFamily: 'Sen-Regular',
    color: '#181C2E',
    lineHeight: 22,
  },
  label: {
    // fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    fontSize: 13,
    fontFamily: 'Sen-Regular',
    color: '#32343E',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#F98A15',
    borderColor: '#F98A15',
  },
  optionText: {
    color: '#464E57',
    fontFamily: 'Sen-Regular',
    fontSize: 16,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  circleButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCircleButton: {
    backgroundColor: '#F98A15',
    borderColor: '#F98A15',
  },
});
