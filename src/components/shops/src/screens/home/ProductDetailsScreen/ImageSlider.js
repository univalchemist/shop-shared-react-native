import React, { useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { TouchableContainer, Box } from '@shops/wrappers/components';
import { ImageProduct } from '@shops/components';
const screenWidth = Dimensions.get('window').width;

const ImageSlider = ({ images = [] }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const renderItem = ({ item, index }) => {
    return (
      <TouchableContainer mr={3} onPress={() => setCurrentImage(index)}>
        <ImageProduct
          imageModel={item}
          width={45}
          height={45}
          resizeMode="cover"
        />
      </TouchableContainer>
    );
  };

  return (
    <Box>
      <ImageProduct
        imageModel={images[currentImage]}
        width={screenWidth - 48}
        height={screenWidth - 48}
        resizeMode="cover"
        my={3}
      />
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
      />
    </Box>
  );
};

export default ImageSlider;
