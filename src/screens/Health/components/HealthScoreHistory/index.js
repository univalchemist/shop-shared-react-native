import React, { useEffect } from 'react';
import HealthScoreHistoryGraph, {
  HealthScoreHistoryLoading,
} from './HealthScoreHistoryGraph';
import { connect } from 'react-redux';
import { PromiseStatus } from '@middlewares';
import { getUserHealthScoreHistory } from '@store/health/actions';
import HealthScoreHistoryError from './HealthScoreHistoryError';
import { Card } from '@wrappers/components';

export const HealthScoreHistory = ({
  healthScoreHistory = {},
  getUserHealthScoreHistory,
}) => {
  useEffect(() => {
    const fetchUserHealthScoreHistory = async () => {
      await getUserHealthScoreHistory();
    };
    fetchUserHealthScoreHistory();
  }, [getUserHealthScoreHistory]);

  const { data, status } = healthScoreHistory;
  const showHealthScoreHistory = () => {
    if (status === PromiseStatus.START) {
      return <HealthScoreHistoryLoading />;
    }
    if (status === PromiseStatus.ERROR) {
      return <HealthScoreHistoryError />;
    }
    if (status === PromiseStatus.SUCCESS) {
      return <HealthScoreHistoryGraph data={data} />;
    }
    return null;
  };

  return (
    <Card bg="white" flexGrow={1} justifyContent="center" px={3} pt={3} pb={3}>
      {showHealthScoreHistory()}
    </Card>
  );
};

const mapStateToProps = ({ health: { healthScoreHistory } }) => ({
  healthScoreHistory,
});

export default connect(mapStateToProps, { getUserHealthScoreHistory })(
  HealthScoreHistory,
);
