import React from 'react';
import { useIntl } from '@wrappers/core/hooks';
import EmptyClinicCard from './EmptyClinicCard';

const NoSelectedClinicCard = () => {
  const intl = useIntl();
  const title = intl.formatMessage({
    id: 'panelSearch.clinicMap.noSelectedClinic.title',
  });
  const description = intl.formatMessage({
    id: 'panelSearch.clinicMap.noSelectedClinic.description',
  });

  return <EmptyClinicCard title={title} description={description} />;
};

export default NoSelectedClinicCard;
