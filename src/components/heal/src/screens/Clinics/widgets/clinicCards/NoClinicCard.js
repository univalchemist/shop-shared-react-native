import React from 'react';
import { useIntl } from '@wrappers/core/hooks';
import EmptyClinicCard from './EmptyClinicCard';

export const NoClinicCard = () => {
  const intl = useIntl();
  const title = intl.formatMessage({
    id: 'panelSearch.clinicMap.noClinicAvailable.title',
  });
  const description = intl.formatMessage({
    id: 'panelSearch.clinicMap.noClinicAvailable.description',
  });

  return <EmptyClinicCard title={title} description={description} />;
};

export default NoClinicCard;
