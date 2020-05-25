import React, { useEffect, useState } from 'react';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { PlainText, Box } from '@wrappers/components';
import { isIphoneX } from '@utils';
import { Button } from '@heal/src/wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { validateRequired } from '@wrappers/core/validations';
import { RadioButtonGroup } from '@wrappers/components/form';
import { CHECK_IN_FORM } from '@routes';

const CheckInSelectMemberScreen = ({
  navigation,
  userId,
  membersMap,
  checkInMemberSubmitCound,
  handleSubmit,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const result = [];
    for (let k in membersMap) {
      if (k == userId)
        result.push({
          label: intl.formatMessage({ id: 'heal.myself' }),
          value: userId.toString(),
        });
      else
        result.push({
          label: membersMap[k].name,
          value: membersMap[k].memberId,
        });
    }
    if (result.length > 0) setOptions(result);
  }, [membersMap]);

  return (
    <Box flex={1} pt={32}>
      <Box flex={1} px={32}>
        <PlainText fontWeight="bold" color={theme.heal.colors.gray[3]}>
          {intl.formatMessage({ id: 'heal.checkin.SelectMember' })}
        </PlainText>
        <PlainText mt={16} color={theme.heal.colors.gray[4]}>
          {intl.formatMessage({ id: 'heal.checkin.NoticeConfirmation' })}
        </PlainText>
        <RadioButtonGroup
          name={'memberId'}
          submitCount={checkInMemberSubmitCound}
          options={options}
          validate={[validateRequired]}
          errorMessageKey={'heal.CheckInForm.required'}
        />
      </Box>
      <Box
        backgroundColor="white"
        position="absolute"
        bottom={0}
        width="100%"
        paddingBottom={isIphoneX() ? 44 : 0}
        borderTopWidth={1}
        borderTopColor={theme.colors.gray[10]}
        paddingHorizontal={32}
        paddingVertical={16}
      >
        <Button
          primary
          title={intl.formatMessage({ id: 'heal.next' })}
          onPress={handleSubmit(data => {
            navigation.navigate(CHECK_IN_FORM);
          })}
        />
      </Box>
    </Box>
  );
};

export default compose(
  connect(state => ({
    membersMap: state.user.membersMap,
    userId: state.user.userId,
    checkInMemberSubmitCound: 0,
  })),
  reduxForm({
    form: 'checkinForm',
    enableReinitialize: true,
  }),
)(CheckInSelectMemberScreen);
