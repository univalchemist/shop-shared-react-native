export const CATEGORY_SPOUSE = 'spouse';
export const CATEGORY_CHILD = 'child';

export const GetDisplayRelationship = (relationship = '') => {
  return relationship.split(/(?=[A-Z])/).join(' ');
};

export const IsCategorySpouse = (relationshipCategory = '') => {
  return (
    relationshipCategory !== null &&
    relationshipCategory.toLowerCase() === CATEGORY_SPOUSE
  );
};

export const IsCategoryChild = (relationshipCategory = '') => {
  return (
    relationshipCategory !== null &&
    relationshipCategory.toLowerCase() === CATEGORY_CHILD
  );
};
