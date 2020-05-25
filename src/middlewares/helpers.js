/* istanbul ignore file */
import perf from '@react-native-firebase/perf';

export const falshy = () => false;

export const customTrace = async () => {
  // Define & start a trace
  const trace = await perf().startTrace('my_awesome_custom_trace');

  // Define trace meta details
  trace.putAttribute('user', 'Test performance');
  trace.putMetric('credits', 1344);

  // Stop the trace
  await trace.stop();
};
