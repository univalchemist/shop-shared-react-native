import React from 'react';
import { Box, ScreenHeadingText } from '@shops/wrappers/components';
import { ProductList } from '@components/shops/legacy/widgets';

const products = [
  {
    clientId: 'cxadevclient1',
    currency: 'HKD',
    discount: 20,
    id: '37',
    imageUrl:
      'https://iremax.vn/wp-content/uploads/2019/12/Sac-du-phong-remax-10000mAh-rpp-147-2.jpg',
    locale: 'en-HK',
    locales: null,
    name: 'Green Turf Golf Course',
    price: 199,
    provider: 'Tennis',
    rating: 3,
    sku: 'Green Turf Golf Course',
    specialPrice: 199,
    url:
      'https://choices.cxapalawan.com/cxadevclient1/green-turf-golf-course.html?sso=true',
    payByWallet: true,
    paidAmount: 25,
  },
  {
    clientId: 'cxadevclient1',
    currency: 'HKD',
    discount: 20,
    id: '37',
    imageUrl:
      'https://iremax.vn/wp-content/uploads/2019/12/Sac-du-phong-remax-10000mAh-rpp-147-2.jpg',
    locale: 'en-HK',
    locales: null,
    name: 'Green Turf Golf Course',
    price: 199,
    provider: 'Tennis',
    rating: 3,
    sku: 'Green Turf Golf Course',
    specialPrice: 199,
    url:
      'https://choices.cxapalawan.com/cxadevclient1/green-turf-golf-course.html?sso=true',
    payByWallet: true,
    paidAmount: 25,
  },
];

const Recommended = () => {
  return (
    <Box py={24} width={'100%'}>
      <Box alignItems={'center'} width={'100%'}>
        <ScreenHeadingText letterSpacing={0} color={'black'}>
          {'Recommended for you'}
        </ScreenHeadingText>
      </Box>
      <Box py={24}>
        <ProductList data={products} />
      </Box>
    </Box>
  );
};

export default Recommended;
