import React from 'react';
import { Box, Image, PlainText } from '@cxa-rn/components';
import { Calendar } from 'react-native-calendars';
import {
  Modal,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@heal/src/wrappers/core/hooks';
import { useIntl } from '@heal/src/wrappers/core/hooks';
import Button from '@heal/src/screens/BookAppointment/widget/Button';
import { icClose } from '@heal/images';

const s = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  base: {
    width: 45,
    height: 45,
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  week: {
    flexDirection: 'row',
  },
  selected: {
    borderRadius: 0,
  },
});

const DateSelector = ({
  visible,
  onClose,
  onPressTime,
  onConfirmDate,
  onSelectDay,
  selectedDay,
  selectedTime,
  error,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const date = new Date();
  const onPress = value => {
    onPressTime(value);
  };
  return (
    <Modal animationType={'slide'} transparent visible={visible}>
      <Box backgroundColor={'rgba(0,0,0,0.32)'} as={SafeAreaView} flex={1}>
        <Box
          borderTopStartRadius={40}
          borderTopEndRadius={40}
          mt={'23%'}
          px={20}
          pt={20}
          backgroundColor={theme.colors.white}
          flex={1}
        >
          <Box
            backgroundColor={theme.colors.error[3]}
            height={6}
            alignSelf={'center'}
            borderRadius={5}
            width={64}
          />
          <Box>
            <Box
              alignItems={'center'}
              justifyContent={'space-between'}
              flexDirection={'row'}
              p={20}
            >
              <PlainText color={theme.colors.gray[0]}>
                {intl.formatMessage({
                  id: 'doctor.scheduleAppointment.pickDate',
                })}
              </PlainText>
              <TouchableOpacity onPress={onClose}>
                <Image source={icClose} />
              </TouchableOpacity>
            </Box>
            <ScrollView>
              <Calendar
                current={selectedDay ? selectedDay : new Date()}
                onDayPress={onSelectDay}
                minDate={date.setDate(date.getDate() + 1)}
                monthFormat={'MMMM'}
                firstDay={1}
                markedDates={{
                  [selectedDay]: { selected: true },
                }}
                theme={{
                  dayTextColor: theme.colors.gray[0],
                  textDayFontWeight: 'normal',
                  'stylesheet.day.basic': {
                    selected: {
                      backgroundColor: theme.colors.primary[0],
                      ...s.selected,
                    },
                    today: s.selected,
                    base: s.base,
                  },
                  'stylesheet.calendar.main': {
                    container: s.container,
                    week: s.week,
                  },
                }}
              />
              <Box p={20}>
                <PlainText color={theme.colors.gray[0]}>
                  {intl.formatMessage({
                    id: 'doctor.scheduleAppointment.pickTime',
                  })}
                </PlainText>
                <Box mt={10} flexDirection={'row'}>
                  <TouchableOpacity onPress={() => onPress('AM')}>
                    <Box
                      backgroundColor={
                        selectedTime === 'AM' && theme.colors.primary[0]
                      }
                      p={7}
                      borderWidth={1}
                    >
                      <PlainText
                        color={selectedTime === 'AM' && theme.colors.white}
                      >
                        {intl.formatMessage({
                          id: 'doctor.scheduleAppointment.time.am',
                        })}
                      </PlainText>
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onPress('PM')}>
                    <Box
                      backgroundColor={
                        selectedTime === 'PM' && theme.colors.primary[0]
                      }
                      p={7}
                      borderWidth={1}
                    >
                      <PlainText
                        color={selectedTime === 'PM' && theme.colors.white}
                      >
                        {intl.formatMessage({
                          id: 'doctor.scheduleAppointment.time.pm',
                        })}
                      </PlainText>
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
              {error && (
                <Box>
                  <PlainText
                    fontSize={12}
                    lineHeight={16}
                    color={theme.colors.error[0]}
                    textAlign={'center'}
                  >
                    {intl.formatMessage({
                      id: 'doctor.scheduleAppointment.pickDate.error',
                    })}
                  </PlainText>
                </Box>
              )}
            </ScrollView>
          </Box>
        </Box>
        <Button
          value={selectedDay && selectedTime}
          onPress={onConfirmDate}
          title={intl.formatMessage({
            id: 'doctor.scheduleAppointment.confirmDate',
          })}
        />
      </Box>
    </Modal>
  );
};

export default DateSelector;
