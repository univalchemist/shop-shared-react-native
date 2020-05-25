export const getDataFromFieldsNotRender = (
  firebaseConfig,
  currentForm,
  defaultValue,
) => {
  const dataFromFieldsNotRender = { ...defaultValue };
  const fieldsNotRender = firebaseConfig.fields.filter(o => !o.visible);

  fieldsNotRender.forEach(field => {
    if (!field.defaultValue) return;
    //check if whether the string match ${ referKey } or just a normal default value
    const regex = field.defaultValue.match(/\$\{(.*?)\}$/i);
    const referKey = regex && regex[1];
    if (referKey) {
      for (let key in currentForm) {
        if (key === referKey) {
          dataFromFieldsNotRender[field.id] = currentForm[referKey];
        }
      }
    } else {
      dataFromFieldsNotRender[field.id] = field.defaultValue;
    }
  });

  return dataFromFieldsNotRender;
};

export const isFormDataEqualsFormView = (firebaseConfig, currentForm) => {
  return Object.keys(currentForm).length === firebaseConfig?.fields?.length;
};
