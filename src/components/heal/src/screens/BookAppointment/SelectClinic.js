import React, { useEffect, useState } from 'react';
import {
  Box,
  PlainText,
  SectionHeadingText,
  ScrollView,
  Button as CoreButton,
  Image,
} from '@cxa-rn/components';
import { useTheme } from '@wrappers/core/hooks';
import {
  RadioButton,
  RadioGroup,
} from '@heal/src/screens/BookAppointment/widget/Radio';
import Button from '@heal/src/screens/BookAppointment/widget/Button';
import { Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { useIntl } from '@heal/src/wrappers/core/hooks';
import moment from 'moment';
import DateSelector from '@heal/src/screens/BookAppointment/widget/DatePicker';

import { icClose } from '@heal/images';
import { HEAL_APPOINTMENT_REQUESTED } from '@routes';
import { requestAppointment } from '@heal/src/store/actions';
import { connect } from 'react-redux';

const SelectClinic = ({ route, navigation, requestAppointment }) => {
  const theme = useTheme();
  const intl = useIntl();
  const [value, setValue] = useState(undefined);
  const [visible, setVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(undefined);
  const [selectedDay, setSelectedDay] = useState(undefined);
  const [addedDates, setAddedDates] = useState([]);
  const [error, setError] = useState(false);
  const doctor = route.params.doctor;
  const { clinics } = doctor;
  const dateFormate = 'MMMM DD, YYYY';

  const buttonContainer = {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderColor: theme.colors.gray[0],
    opacity: 0.5,
    marginTop: 20,
  };

  //PARAM FOR REQUEST
  // {
  //   "clinicProviderId": 0,
  //   "doctorId": 0,
  //   "clinicId": 0,
  //   "firstPreferredTime": "2020-05-13T04:33:17.501Z",
  //   "firstSession": "AM",
  //   "secondPreferredTime": "2020-05-13T04:33:17.501Z",
  //   "secondSession": "AM",
  //   "thirdPreferredTime": "2020-05-13T04:33:17.501Z",
  //   "thirdSession": "AM"
  // }

  const onConfirmDate = () => {
    const dates = addedDates.map(item => {
      return item.date;
    });
    if (dates.includes(moment(selectedDay).format())) {
      setError(true);
    } else {
      setVisible(!visible);
      let dates = addedDates;
      dates.push({ date: selectedDay, time: selectedTime });
      setAddedDates(dates);
      setSelectedDay(undefined);
      setSelectedTime(undefined);
      setError(false);
    }
  };

  const onDeleteDate = index => {
    const Dates = addedDates;

    Dates.splice(index, 1);
    setAddedDates(prevState => [...Dates]);
  };

  const renderAlert = index => {
    Alert.alert(
      intl.formatMessage({
        id: 'doctor.scheduleAppointment.alert',
        defaultMessage: 'Are you sure you want to delete this date ?',
      }),
      '',
      [
        {
          text: intl.formatMessage({
            id: 'doctor.scheduleAppointment.delete',
            defaultMessage: 'Delete',
          }),
          onPress: () => onDeleteDate(index),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({
            id: 'doctor.scheduleAppointment.cancel',
            defaultMessage: 'Cancel',
          }),
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <Box flex={1} as={SafeAreaView} backgroundColor={theme.colors.white}>
      <ScrollView backgroundColor={theme.colors.white}>
        <Box px={32} pt={32}>
          <SectionHeadingText>
            {intl.formatMessage({
              id: 'doctor.scheduleAppointment.selectClinic',
            })}
          </SectionHeadingText>
        </Box>
        <Box pt={32} px={32}>
          <RadioGroup value={value} onChange={value => setValue(value)}>
            {clinics.map(item => (
              <RadioButton
                key={item.id}
                extra={item.address}
                value={item.id}
                text={item.name}
              />
            ))}
          </RadioGroup>
        </Box>
        <Box pl={32}>
          <SectionHeadingText>
            {intl.formatMessage({
              id: 'doctor.scheduleAppointment.pickDates',
            })}
          </SectionHeadingText>
          <PlainText>
            {intl.formatMessage({
              id: 'doctor.scheduleAppointment.maxDates',
            })}
          </PlainText>
        </Box>
        <Box p={32}>
          {addedDates.map((item, index) => {
            return (
              <Box
                key={index}
                alignItems={'center'}
                justifyContent={'space-between'}
                flexDirection={'row'}
                borderBottomWidth={1}
                borderBottomColor={theme.colors.gray[10]}
                py={15}
              >
                <PlainText>{`${moment(item.date).format(dateFormate)} at ${
                  item.time
                } `}</PlainText>
                <TouchableOpacity onPress={() => renderAlert(index)}>
                  <Image source={icClose} />
                </TouchableOpacity>
              </Box>
            );
          })}
          {addedDates.length < 3 && (
            <CoreButton
              onPress={() => setVisible(!visible)}
              buttonStyle={buttonContainer}
              titleStyle={{
                color: theme.colors.gray[0],
              }}
              title={intl.formatMessage({
                id: 'doctor.scheduleAppointment.addDates',
              })}
            />
          )}
          <DateSelector
            visible={visible}
            onConfirmDate={() => onConfirmDate()}
            onPressTime={time => setSelectedTime(time)}
            onSelectDay={day => {
              setSelectedDay(day.dateString);
              setError(false);
            }}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            onClose={() => setVisible(!visible)}
            error={error}
          />
        </Box>
      </ScrollView>
      <Button
        onPress={() => {
          requestAppointment(
            doctor.clinicProviderId,
            doctor.id,
            value,
            addedDates,
          );
          navigation.navigate(HEAL_APPOINTMENT_REQUESTED);
        }}
        value={value && addedDates.length !== 0}
        title={intl.formatMessage({
          id: 'doctor.scheduleAppointment.requestAppointment',
        })}
      />
    </Box>
  );
};

const mapStateToProps = ({ heal }) => ({
  heal,
});

export default connect(mapStateToProps, { requestAppointment })(SelectClinic);
