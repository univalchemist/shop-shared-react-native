import React from 'react';
import { renderForTest } from '@testUtils';
import { ShopHeader } from '../index';
import { act, fireEvent } from 'react-native-testing-library';
import { SHOP_CART_SCREEN } from '@shops/navigation/routes';
import ModalDropdown from 'react-native-modal-dropdown';
import { Image } from '@shops/wrappers/components';
import { menu as MenuImg, xmark as xMarkIcon } from '@shops/assets/icons';
import { Platform } from 'react-native';
import * as utils from '@utils/isIphoneX';
import navigation from '@testUtils/__mocks__/navigation';

const initialState = {
  shop: {
    cart: {},
  },
};

describe('Header', () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation(isSearch => [isSearch, setState]);

  test('should match snapshot', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const Component = renderForTest(<ShopHeader navigation={navigation} />, {
      initialState,
    });
    expect(Component.toJSON()).toMatchSnapshot();
  });

  test('should show menu properly', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const { getByTestId, getByType, getAllByType } = renderForTest(
      <ShopHeader navigation={navigation} />,
      {
        initialState,
      },
    );
    const modalDropdown = getByType(ModalDropdown);
    act(() => {
      fireEvent(modalDropdown, 'dropdownWillShow');
    });
    const xMarkmage = getByType(Image);
    expect(xMarkmage.props.source).toBe(xMarkIcon);
    act(() => {
      fireEvent(modalDropdown, 'dropdownWillHide');
    });
    const menuImage = getAllByType(Image)[0];
    expect(menuImage.props.source).toBe(MenuImg);
  });

  test('should navigate when cart icon is pressed', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const { getByTestId } = renderForTest(
      <ShopHeader navigation={navigation} />,
      {
        initialState,
      },
    );
    const HeaderButton = getByTestId('cartIcon');
    act(() => {
      fireEvent.press(HeaderButton);
    });

    expect(navigation.navigate).toBeCalled();
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(SHOP_CART_SCREEN);
  });

  test('should have height 56 when cart platform is android', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    Platform.OS = 'android';
    const { getByTestId } = renderForTest(
      <ShopHeader navigation={navigation} />,
      {
        initialState,
      },
    );
    const ContainerHeader = getByTestId('boxContainer');
    expect(ContainerHeader.props.height).toBe(56);
  });

  test('should have height 88 when device is iPhoneX', async () => {
    Platform.OS = 'ios';
    jest.spyOn(utils, 'isIphoneX').mockReturnValue(true);
    const { getByTestId } = renderForTest(<ShopHeader />, {
      initialState,
    });
    const ContainerHeader = getByTestId('boxContainer');
    expect(ContainerHeader.props.height).toBe(88);
  });

  test('should navigate correctly when user press', async () => {
    const { getByType } = renderForTest(
      <ShopHeader navigation={navigation} />,
      {
        initialState,
      },
    );
    const ModalDropdownComp = getByType(ModalDropdown);
    fireEvent(ModalDropdownComp, 'renderSeparator');
    fireEvent(ModalDropdownComp, 'select', 1);
    fireEvent(ModalDropdownComp, 'renderRow', {
      image: 'imageUrl',
      titleId: 'shop.menu.shopHome',
    });

    expect(navigation.navigate).toBeCalledWith('ORDER_HISTORY_SCREEN');
  });


  // test('should not navigate method when search icon is pressed', async () => {
  //   const navigation = {
  //     navigate: jest.fn(),
  //   };
  //   const { getByTestId } = renderForTest(
  //     <ShopHeader navigation={navigation} />, {
  //       initialState,
  //     }
  //   );
  //   const HeaderButton = getByTestId('searchIcon');
  //   const boxContainer = getByTestId('boxContainer');
  //   act(() => {
  //     fireEvent.press(HeaderButton);
  //   });
  //   expect(boxContainer.props.backgroundColor).toEqual(theme.colors.gray[0]);
  //   expect(navigation.navigate).not.toBeCalled();
  //   expect(navigation.navigate).toHaveBeenCalledTimes(0);
  // });

  // test('should navigate method when onSubmitEditing is called ', async () => {
  //   const navigation = {
  //     navigate: jest.fn(),
  //   };
  //   const { getByTestId } = renderForTest(
  //     <ShopHeader navigation={navigation} />, {
  //       initialState,
  //     }
  //   );
  //
  //   const HeaderButton = getByTestId('searchIcon');
  //   act(() => HeaderButton.props.onPress());
  //
  //   const SearchBox = getByTestId('searchBox');
  //   act(() => {
  //     SearchBox.props.onSubmitEditing();
  //     fireEvent(SearchBox, 'onChangeText', 'test');
  //   });
  //   expect(navigation.navigate).toBeCalled();
  //   expect(navigation.navigate).toHaveBeenCalledWith(
  //     NAVIGATION_SEARCH_SCREEN_PATH,
  //   );
  // });
});
