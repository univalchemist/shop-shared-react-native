import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Loader } from '@wrappers/components';
import {
  getUserFaceAgingResults,
  fetchUserLifestyleResults,
  fetchLifestyleTips,
} from '@store/health/actions';
import { localizeServerError } from '@utils';
import { Alert, ScrollView } from 'react-native';
import LifestyleResultsScreen from './LifestyleResultsScreen';
import LifestyleLandingPage from './LifestyleLandingPage';
import { injectIntl } from 'react-intl';
import { useFirebase } from '@navigations';

const mapStateToProps = ({
  health: { hasLifestyleResults, fetchUserLifestyleResultsCompleted },
  intl: { setLocaleCompleted },
}) => ({
  hasLifestyleResults,
  fetchUserLifestyleResultsCompleted,
  setLocaleCompleted,
});

const enhance = compose(
  connect(mapStateToProps, {
    getUserFaceAgingResults,
    fetchUserLifestyleResults,
    fetchLifestyleTips,
  }),
  injectIntl,
);

export const HealthScreen = ({
  getUserFaceAgingResults,
  hasLifestyleResults,
  fetchUserLifestyleResultsCompleted,
  setLocaleCompleted,
  fetchUserLifestyleResults,
  fetchLifestyleTips,
  intl,
  navigation,
}) => {
  const {
    remoteConfig: { health_screen },
  } = useFirebase();
  useEffect(() => {
    if (setLocaleCompleted) {
      const fetchUserFaceagingResults = async () => {
        await getUserFaceAgingResults();
      };
      fetchUserFaceagingResults();
    }
  }, [getUserFaceAgingResults, setLocaleCompleted]);

  useEffect(() => {
    if (setLocaleCompleted) {
      const getUserLifestyleResults = async () => {
        try {
          await fetchUserLifestyleResults();
        } catch (error) {
          const { subject, message } = localizeServerError(
            error,
            {
              subjectId: 'somethingWentWrong',
              prefix: 'serverErrors.getUserHealthResults',
            },
            intl,
          );

          Alert.alert(subject, message);
        }
      };
      const getLifestyleTips = async () => {
        await fetchLifestyleTips();
      };

      getUserLifestyleResults();
      getLifestyleTips();
    }
  }, [fetchUserLifestyleResults, fetchLifestyleTips, intl, setLocaleCompleted]);

  if (!fetchUserLifestyleResultsCompleted)
    return (
      <ScrollView>
        <Loader primary />
      </ScrollView>
    );

  return (
    <>
      {hasLifestyleResults ? (
        <LifestyleResultsScreen navigation={navigation} />
      ) : (
        <LifestyleLandingPage navigation={navigation} />
      )}
    </>
  );
};

HealthScreen.propTypes = {
  hasLifestyleResults: PropTypes.bool,
  getUserFaceAgingResults: PropTypes.func.isRequired,
  fetchUserLifestyleResults: PropTypes.func.isRequired,
  health_screen: PropTypes.shape({}),
  results: PropTypes.shape({
    bmi: PropTypes.number,
    bmiClass: PropTypes.string,
    bmiPoint: PropTypes.number,
    totalPoint: PropTypes.number,
    totalRisk: PropTypes.string,
    smokeRisk: PropTypes.string,
    alcoholRisk: PropTypes.string,
    exerciseRisk: PropTypes.string,
  }),
  hasHealthResults: PropTypes.bool,
  faceAging: PropTypes.shape({
    faceAgingIsDone: PropTypes.bool,
    expectedTotalResults: PropTypes.number,
    currentTotalResults: PropTypes.number,
    results: PropTypes.shape({}),
  }),
  fetchUserLifestyleResultsCompleted: PropTypes.bool,
};

export default enhance(HealthScreen);
