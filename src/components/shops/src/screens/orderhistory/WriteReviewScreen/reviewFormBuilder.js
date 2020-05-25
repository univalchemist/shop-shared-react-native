import {
  Box,
  InputField,
  Text,
  TextAreaField,
} from '@shops/wrappers/components';
import React from 'react';
import { useIntl } from '@shops/wrappers/core/hooks';
import CustomRatingStars from './CustomRatingStars';

const inputType = {
  text: 'text',
  textArea: 'textarea',
};

export const reviewFieldBuilder = (fields,intl) => {
  if (!fields) return null;
  return Object.keys(fields).map(key => {
    const input = fields[key];
    switch (input.type) {
      case inputType.text:
        return (
          <InputField
            key={key}
            name={input.name}
            hint={intl.formatMessage({ id: 'shop.common.optional' })}
            label={intl.formatMessage({
              id: input.labelId,
              defaultMessage: input.label,
            })}
          />
        );
      case inputType.textArea:
        return (
          <TextAreaField
            key={key}
            name={input.name}
            hint={intl.formatMessage({ id: 'shop.common.optional' })}
            label={intl.formatMessage({
              id: input.labelId,
              defaultMessage: input.label,
            })}
          />
        );
    }
  });
};

export const reviewRatingBuilder = (ratings,intl, onRatingChange) => {
  if (!ratings) return null;
  return Object.keys(ratings).map((key, index) => {
    const ratingSection = ratings[key];
    return (
      <Box key={key}>
        <Text>
          {intl.formatMessage({
            id: ratingSection.labelId,
            defaultMessage: ratingSection.label,
          })}
        </Text>
        <CustomRatingStars
          enable
          mt={8}
          mb={16}
          options={ratingSection.options}
          starContainerStyle={style.starContainerStyle}
          currentRating={ratingSection.currentRating}
          onPress={starId => {
            onRatingChange?.(key, starId);
          }}
        />
      </Box>
    );
  });
};

const style = {
  startContainerStyle: {
    marginLeft: 5,
  },
};
