import React from 'react';
import { renderForTest } from '@testUtils';
import NoClinicCard from '../NoClinicCard';
import EmptyClinicCard from '../EmptyClinicCard';
import messages from '@messages/en-HK.json';
import * as translations from '../../../../../../messages';

describe('NoClinicCard', () => {
  const emptyClinicCard = component => component.queryByType(EmptyClinicCard);
  const renderNoClinicCard = ({}) => renderForTest(<NoClinicCard />);

  delete translations.default;

  // describe.each(Object.keys(translations))('%s text resources', locale => {
  //   const resourceKeys = [
  //     'panelSearch.clinicMap.noClinicAvailable.title',
  //     'panelSearch.clinicMap.noClinicAvailable.description',
  //   ];
  //
  //   test.each(resourceKeys)(
  //     'should have translation for key %s',
  //     resourceKey => {
  //       expect(translations[locale][resourceKey]).toBeDefined();
  //     },
  //   );
  // });

  let component;
  beforeEach(() => {
    component = renderNoClinicCard({});
  });

  it('should render a EmptyClinicCard', () => {
    expect(component.queryAllByType(EmptyClinicCard).length).toBe(1);
  });

  it('should pass title text as title to EmptyClinicCard', () => {
    expect(emptyClinicCard(component).props.title).toBe(
      messages['panelSearch.clinicMap.noClinicAvailable.title'],
    );
  });

  it('should pass description text as description to EmptyClinicCard', () => {
    expect(emptyClinicCard(component).props.description).toBe(
      messages['panelSearch.clinicMap.noClinicAvailable.description'],
    );
  });
});
