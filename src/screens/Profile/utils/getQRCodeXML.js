// prettier-ignore
const getQRCodeXML = ({
  name,
  membershipNumber,
  certificateNumber,
  insurerCode,
  insurerName,
  policyNumber,
  expiryDate,
}) =>
  [
    '<?xml version="1.0"?>',
    '<medical_card>',
    '<insurance_company_code>',
    insurerCode,
    '</insurance_company_code>',
    '<insurance_company_name>',
    insurerName,
    '</insurance_company_name>',
    '<insured_name>',
    name,
    '</insured_name>',
    '<policy_no>',
    policyNumber,
    '</policy_no>',
    '<certificate_no>',
    certificateNumber,
    '</certificate_no>',
    '<membership_no>',
    membershipNumber,
    '</membership_no>',
    '<expiry_date>',
    expiryDate,
    '</expiry_date>',
    '</medical_card>',
  ].join('');

export default getQRCodeXML;
