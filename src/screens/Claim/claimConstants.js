/* istanbul ignore file */
const DEPENDENT = 'Dependant';
const PENDING = 'Pending Verification';
const APPROVED = 'Approved';
const REJECTED = 'Rejected';

const statusMap = {
  [PENDING]: 'Pending',
  [APPROVED]: 'Approved',
  [REJECTED]: 'Rejected',
};

export { DEPENDENT, PENDING, APPROVED, REJECTED, statusMap };
