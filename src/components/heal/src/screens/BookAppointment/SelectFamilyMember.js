import React, { useEffect, useState } from 'react';
import { Box, PlainText, SectionHeadingText } from '@cxa-rn/components';
import { useTheme } from '@wrappers/core/hooks';
import {
  RadioButton,
  RadioGroup,
} from '@heal/src/screens/BookAppointment/widget/Radio';
import Button from '@heal/src/screens/BookAppointment/widget/Button';
import { SafeAreaView } from 'react-native';
import { useIntl } from '@heal/src/wrappers/core/hooks';
import { HEAL_SELECT_CLINIC } from '@routes';
import { getMembers } from '@heal/src/store/actions';
import { connect } from 'react-redux';

const SelectFamilyMember = props => {
  const theme = useTheme();
  const intl = useIntl();
  const [patient, setPatient] = useState(null);
  const [familyMember, setFamilyMember] = useState([]);
  const { route, navigation, getMembers, member } = props;
  const doctor = route.params.doctor;

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  useEffect(() => {
    if (member.relationships?.length > 0) {
      const { relationships } = member;
      let dependent = [];
      dependent.push({
        _id: member.memberId,
        name: intl.formatMessage({ id: 'heal.myself' }),
      });
      relationships.map(item => {
        dependent.push({
          _id: item.memberId,
          name: item.fullName,
        });
      });
      setFamilyMember(dependent);
    } else {
      let dependent = [];
      dependent.push({
        _id: member.memberId,
        name: intl.formatMessage({ id: 'heal.myself' }),
      });
      setFamilyMember(dependent);
    }
  }, [intl, member]);

  return (
    <Box
      height={'100%'}
      as={SafeAreaView}
      backgroundColor={theme.colors.white}
      flex={1}
    >
      <Box flex={1} p={32}>
        <SectionHeadingText
          lineHeight={22}
          letterSpacing={0.3}
          fontSize={theme.fontSizes[2]}
        >
          {intl.formatMessage({
            id: 'doctor.scheduleAppointment.selectFamilyMember',
          })}
        </SectionHeadingText>
        <PlainText color={theme.colors.gray[8]} mt={16}>
          {intl.formatMessage({
            id: 'doctor.scheduleAppointment.confirmation',
          })}
        </PlainText>
        <Box py={45}>
          <RadioGroup onChange={value => setPatient(value)} value={patient}>
            {familyMember.map((item, index) => (
              <RadioButton key={index} value={item._id} text={item.name} />
            ))}
          </RadioGroup>
        </Box>
      </Box>
      <Button
        onPress={() =>
          navigation.navigate(HEAL_SELECT_CLINIC, {
            doctor: doctor,
            memberId: patient,
          })
        }
        value={patient}
        title={intl.formatMessage({
          id: 'doctor.scheduleAppointment.next',
        })}
      />
    </Box>
  );
};

const mapStateToProps = ({ heal: { member } }) => ({
  member,
});

export default connect(mapStateToProps, { getMembers })(SelectFamilyMember);
