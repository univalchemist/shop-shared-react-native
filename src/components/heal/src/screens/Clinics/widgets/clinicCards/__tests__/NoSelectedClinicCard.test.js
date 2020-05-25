import React from 'react';
import { renderForTest } from '@testUtils';
import NoSelectedClinicCard from '../NoSelectedClinicCard';
import EmptyClinicCard from '../EmptyClinicCard';
import messages from '@messages/en-HK.json';
import * as translations from '../../../../../../../../../messages';

describe('NoSelectedClinicCard', () => {
  const emptyClinicCard = component => component.queryByType(EmptyClinicCard);
  const renderNoSelectedClinicCard = ({}) =>
    renderForTest(<NoSelectedClinicCard />);

  delete translations.default;

  describe.each(Object.keys(translations))('%s text resources', locale => {
    const resourceKeys = [
      'panelSearch.clinicMap.noSelectedClinic.title',
      'panelSearch.clinicMap.noSelectedClinic.description',
    ];

    test.each(resourceKeys)(
      'should have translation for key %s',
      resourceKey => {
        expect(translations[locale][resourceKey]).toBeDefined();
      },
    );
  });

  let component;
  beforeEach(() => {
    component = renderNoSelectedClinicCard({});
  });

  it('should render a EmptyClinicCard', () => {
    expect(component.queryAllByType(EmptyClinicCard).length).toBe(1);
  });

  it('should pass title text as title to EmptyClinicCard', () => {
    expect(emptyClinicCard(component).props.title).toBe(
      messages['panelSearch.clinicMap.noSelectedClinic.title'],
    );
  });

  it('should pass description text as description to EmptyClinicCard', () => {
    expect(emptyClinicCard(component).props.description).toBe(
      messages['panelSearch.clinicMap.noSelectedClinic.description'],
    );
  });
});
