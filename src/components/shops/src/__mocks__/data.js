export const CURRENCY = {
  baseCurrency: 'SGD',
  baseCurrencySymbol: 'SG$',
  defaultCurrency: 'SGD',
  defaultCurrencySymbol: 'SG$',
};

export const STORE_CONFIGS = {
  id: 1,
  code: 'default',
  locale: 'en_US',
  timeZone: 'Asia/Singapore',
  weightUnits: 'Asia/Singapore',
  currency: CURRENCY,
};

export const SORTINGS = [
  {
    id: 'bestselling',
    name: 'Best selling',
    direction: 'DESC',
  },
  {
    id: 'price',
    name: 'Price high to low',
    direction: 'DESC',
  },
  {
    id: 'price',
    name: 'Price low to high',
    direction: 'ASC',
  },
  {
    id: 'discount',
    name: 'Discount high to low',
    direction: 'DESC',
  },
  {
    id: 'discount',
    name: 'Discount low to high',
    direction: 'ASC',
  },
];

export const CATEGORY_TREE = {
  id: 2,
  parentId: 1,
  name: 'All products',
  isActive: true,
  position: 1,
  includeInMenu: true,
  level: 1,
  productCount: 20,
  children: [
    {
      id: 3,
      parentId: 2,
      name: 'Alternative medicine',
      isActive: true,
      position: 1,
      includeInMenu: true,
      level: 2,
      productCount: 10,
      children: [
        {
          id: 4,
          parentId: 3,
          name: 'All alternative medicine',
          isActive: true,
          position: 1,
          includeInMenu: true,
          level: 3,
          productCount: 2,
          children: [],
        },
        {
          id: 5,
          parentId: 3,
          name: 'TCM',
          isActive: true,
          position: 2,
          includeInMenu: true,
          level: 3,
          productCount: 2,
          children: [],
        },
        {
          id: 6,
          parentId: 3,
          name: 'Homeopathy',
          isActive: true,
          position: 3,
          includeInMenu: true,
          level: 3,
          productCount: 3,
          children: [],
        },
        {
          id: 7,
          parentId: 3,
          name: 'Naturopathy',
          isActive: false,
          position: 4,
          includeInMenu: true,
          level: 3,
          productCount: 2,
          children: [],
        },
      ],
    },
    {
      id: 4,
      parentId: 2,
      name: 'Foods',
      isActive: false,
      position: 2,
      includeInMenu: true,
      level: 2,
      productCount: 0,
      children: [],
    },
  ],
};

export const GET_REVIEW_FORM = {
  ratings: {
    'overall_ratings-1': {
      rating_id: 1,
      position: 10,
      is_active: true,
      label: 'Overall ratings',
      labelId: 'shop.writeReview.overallRating',
      options: {
        oid_1: 1,
        oid_2: 2,
        oid_3: 3,
        oid_4: 4,
        oid_5: 5,
      },
    },
    'productservice_quality-2': {
      rating_id: 2,
      position: 20,
      is_active: true,
      label: 'Product/Service quality',
      labelId: 'shop.writeReview.productServiceQuality',
      options: {
        oid_6: 6,
        oid_7: 7,
        oid_8: 8,
        oid_9: 9,
        oid_10: 10,
      },
    },
    'purchase_experience-3': {
      rating_id: 3,
      position: 30,
      is_active: true,
      label: 'Purchase experience',
      labelId: 'shop.writeReview.purchaseExperience',
      options: {
        oid_11: 11,
        oid_12: 12,
        oid_13: 13,
        oid_14: 14,
        oid_15: 15,
      },
    },
    'redemption_experience-4': {
      rating_id: 4,
      position: 40,
      is_active: true,
      label: 'Redemption experience',
      labelId: 'shop.writeReview.redemptionExperience',
      options: {
        oid_16: 16,
        oid_17: 17,
        oid_18: 18,
        oid_19: 19,
        oid_20: 20,
      },
    },
  },
  fields: {
    nickname: {
      label: 'Name',
      labelId: 'shop.writeReview.name',
      name: 'nickname',
      type: 'text',
    },
    title: {
      label: 'Headline',
      labelId: 'shop.writeReview.headLine',
      name: 'title',
      type: 'text',
    },
    detail: {
      label: 'Write your review',
      labelId: 'shop.writeReview.writeYourReview',
      name: 'detail',
      type: 'textarea',
    },
  },
};

export const GET_TRACK_ORDER = [
  {
    productId: 0,
    sku: 'string',

    shipments: [
      {
        deliveryPartner: 'HK Post Pte Ltd',
        deliveryPartnerCode: 'string',
        trackingNumber: 'HKP-1233455',
        description: 'string',
        address: {
          id: 0,
          region: {
            id: 0,
            region: 'string',
            code: 'string',
          },
          regionId: 0,
          customerAddress: '11 Le Duan',
          countryId: 'string',
          telephone: '+84123456789',
          postCode: 'string',
          city: 'string',
          firstName: 'Thuong',
          lastName: 'Hoang',
          street: ['string'],
          isSameAsBilling: true,
          saveAddress: true,
        },
      },
    ],
    status: 'PENDING',
    quantityOrdered: 0,
    quantityShipped: 0,
  },
];
