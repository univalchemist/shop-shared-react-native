import { flatten } from 'ramda';

export const getInitialValuesFromQuestions = questions => {
  const reducer = (accumulator, question) => {
    accumulator[question.name] = question.defaultValue;
    return accumulator;
  };

  return Object.keys(questions.questionGroups)
    .map(questionGroupName => questions.questionGroups[questionGroupName])
    .reduce((accumulator, questions) => [...accumulator, ...questions], [])
    .reduce(reducer, {});
};

const flattenQuestionGroups = questions =>
  Object.keys(questions.questionGroups)
    .map(key => questions.questionGroups[key])
    .reduce((accumulator, questions) => [...accumulator, ...questions], []);

export const filterFormValues = (values, questions) => {
  const findParentQuestion = (dependentQuestion, questionArray) => {
    return questionArray.find(
      q => q.questionId === dependentQuestion.parentQuestionId,
    );
  };
  const isActive = (parentQuestion, dependentQuestion) => {
    return flatten([values[parentQuestion.name]]).some(v =>
      dependentQuestion.activationAnswer.includes(v),
    );
  };
  const questionArray = flattenQuestionGroups(questions);
  questionArray.forEach(question => {
    if (
      question.dependentQuestion &&
      !isActive(findParentQuestion(question, questionArray), question)
    ) {
      values[question.name] = null;
    }
  });
  return values;
};

export const assignDefaultValueForDependentQuestions = (values, questions) => {
  const questionArray = flattenQuestionGroups(questions);
  questionArray.forEach(question => {
    if (
      question.dependentQuestion &&
      (values[question.name] === null || values[question.name] === undefined)
    ) {
      values[question.name] = question.defaultValue;
    }
  });
  return values;
};
