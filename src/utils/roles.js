export const EMPLOYEE_ROLE = 'employee';
export const DEPENDENT_ROLE = 'dependent';

export const IsEmployee = (role = '') => {
  return role !== null && role.toLowerCase() === EMPLOYEE_ROLE;
};

export const IsDependent = (role = '') => {
  return role !== null && role.toLowerCase() === DEPENDENT_ROLE;
};
