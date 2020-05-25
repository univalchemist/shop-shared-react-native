import React from 'react';

export const DatePicker = ({ field }) => {
  const setIsVisible = () => {};
  return <>{field({ setIsVisible })}</>;
};
