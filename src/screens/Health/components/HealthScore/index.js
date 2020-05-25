import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import HealthScoreError from './HealthScoreError';
import HealthScoreDisplay, { HealthScoreLoading } from './HealthScoreDisplay';
import { PromiseStatus } from '@middlewares';
import { Card } from '@wrappers/components';
import { getUserHealthScore } from '@store/health/actions';

export const HealthScore = ({ healthScore = {}, getUserHealthScore }) => {
  useEffect(() => {
    const fetchUserHealthScore = async () => {
      await getUserHealthScore();
    };
    fetchUserHealthScore();
  }, [getUserHealthScore]);

  const { score, status } = healthScore;
  const isValidScore = !isNaN(parseInt(score, 10));
  const showHealthScore = () => {
    if (status === PromiseStatus.START) {
      return <HealthScoreLoading />;
    }
    if (status === PromiseStatus.ERROR || !isValidScore) {
      return <HealthScoreError />;
    }
    if (status === PromiseStatus.SUCCESS) {
      return <HealthScoreDisplay score={score} />;
    }
    return null;
  };

  return (
    <Card bg="white" flexGrow={1} px={4} pt={4} pb={24}>
      {showHealthScore()}
    </Card>
  );
};

const mapStateToProps = ({ health: { healthScore } }) => ({
  healthScore,
});

export default connect(mapStateToProps, { getUserHealthScore })(HealthScore);
