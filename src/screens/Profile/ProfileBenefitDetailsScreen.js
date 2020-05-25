import React from 'react';
import { SectionList, Dimensions, Platform } from 'react-native';
import {
  Box,
  SectionHeadingText,
  Image,
  Text,
  Divider,
} from '@wrappers/components';
import { FormattedMessage } from 'react-intl';
import {
  nonPanelDoctorIcon,
  panelDoctorIcon,
  checkPointVisitIcon,
} from '@images';

const WELLNESS_PRODUCT = 'WellnessFlexibleSpending';
const MATERNITY_PRODUCT = 'MaternitySubsidy';

const productTypesWithGeneralLegend = [MATERNITY_PRODUCT, WELLNESS_PRODUCT];

const PanelSection = ({ labelId, label, imageSource, ...props }) => (
  <Box flexDirection="row" flex={1} {...props}>
    {!!imageSource && (
      <Box flex={1} pr={1} pt={2}>
        <Image source={imageSource} />
      </Box>
    )}
    <Box flex={4} flexDirection="column">
      <Text color="gray.8" fontSize={12}>
        <FormattedMessage id={labelId} />
      </Text>
      <Text
        flex={1}
        flexWrap={'wrap'}
        color="gray.8"
        fontSize={12}
        lineHeight={16}
        letterSpacing={0.4}
      >
        {label}
      </Text>
    </Box>
  </Box>
);

const PanelLegendBox = ({
  product: { productType, panelLabel, nonPanelLabel, freeChoiceLabel },
}) => {
  const shadow =
    Platform.OS === 'android'
      ? {
          shadowOffset: '0px 3px',
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowColor: '#000',
          elevation: 4,
        }
      : { borderBottomWidth: 1, borderBottomColor: '#e5e5e5' };

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width={Dimensions.get('window').width}
      backgroundColor="white"
      flexDirection="row"
      alignItems="center"
      height={64}
      {...shadow}
    >
      {productTypesWithGeneralLegend.includes(productType) ? (
        <Box flex={1} px={2}>
          <Text
            textAlign={'center'}
            flexWrap={'wrap'}
            color="gray.8"
            fontSize={12}
            lineHeight={16}
            letterSpacing={0.4}
          >
            <FormattedMessage
              id="profile.myBenefits.freeChoiceDoctor"
              values={{ description: freeChoiceLabel }}
            />
          </Text>
        </Box>
      ) : (
        <Box flexDirection="row">
          <PanelSection
            labelId="profile.myBenefits.panelDoctor"
            label={panelLabel}
            imageSource={panelDoctorIcon}
            pl={4}
          />
          <PanelSection
            labelId="profile.myBenefits.nonPanelDoctor"
            label={nonPanelLabel}
            imageSource={nonPanelDoctorIcon}
            pl={2}
            pr={3}
          />
        </Box>
      )}
    </Box>
  );
};

const CheckpointVisitItem = ({
  product: { unlimitedCheckpoint },
  checkpointVisits,
  memberCheckpointVisit = { usedCount: 0 },
  ...props
}) => {
  const { limit } = checkpointVisits;
  const { usedCount } = memberCheckpointVisit;
  const active = limit - usedCount;

  return (
    <Box flexDirection="row" alignItems="center" {...props}>
      <Image source={checkPointVisitIcon} mr={16} />
      <Box flexDirection="column">
        <Text color="gray.3">
          <FormattedMessage
            id={'profile.plan.service.checkpointVisits.label'}
          />
        </Text>
        {unlimitedCheckpoint === true ? (
          <Text>
            <FormattedMessage id={'profile.plan.service.unlimited'} />
          </Text>
        ) : (
          <Text>
            <FormattedMessage
              id={`profile.plan.service.checkpointVisits`}
              values={{ active, limit }}
            />
          </Text>
        )}
      </Box>
    </Box>
  );
};

const ServiceListItem = ({
  product,
  service: { metaText, id: serviceId, details = [] },
  memberBenefit,
  ...props
}) => {
  return (
    <Box px={32} {...props}>
      {!!metaText && (
        <Box mb={24}>
          <Text>{metaText}</Text>
        </Box>
      )}

      {details.map((detail, index) => {
        const {
          description,
          panelVisit,
          nonPanelVisit,
          checkpointVisits,
        } = detail;

        return (
          <Box key={index}>
            {!!description && (
              <Box pb={16} pr={32} flexDirection="row" alignItems="center">
                <Text>{description}</Text>
              </Box>
            )}

            {!!panelVisit && (
              <Box pb={16} pr={32} flexDirection="row" alignItems="center">
                <Image source={panelDoctorIcon} mr={16} />
                <Text>{panelVisit}</Text>
              </Box>
            )}

            {!!nonPanelVisit && (
              <Box pb={16} pr={32} flexDirection="row" alignItems="center">
                <Image source={nonPanelDoctorIcon} mr={16} />
                <Text>{nonPanelVisit}</Text>
              </Box>
            )}

            {!!checkpointVisits && (
              <CheckpointVisitItem
                product={product}
                checkpointVisits={checkpointVisits}
                memberCheckpointVisit={memberBenefit.checkpointVisits?.find(
                  cpv => cpv.serviceId === serviceId,
                )}
              />
            )}
          </Box>
        );
      })}
      <Divider full my={24} />
    </Box>
  );
};

const WellnessServiceListItem = ({
  service: { details = [] },
  relationshipCategory,
  memberName,
  externalWalletBalanceText,
  minimumFractionDigits = 2,
  ...props
}) => {
  const detail = details.find(d => d.forRelationship === relationshipCategory);
  if (!detail) return null;

  const { annualLimitText } = detail;
  const creditRemaining = externalWalletBalanceText || '-';
  return (
    <Box px={4} {...props}>
      <Box pt={2} pb={3} pr={4} flexDirection="row" alignItems="center">
        <SectionHeadingText fontSize={2} fontWeight={600}>
          {memberName}
        </SectionHeadingText>
      </Box>

      <Box pb={2} pr={4} flexDirection="row" alignItems="center">
        <Text>
          <FormattedMessage
            id={`profile.myBenefits.wellness.balance`}
            values={{
              creditRemaining,
              annualLimit: annualLimitText,
            }}
          />
        </Text>
      </Box>
      <Divider full my={24} />
    </Box>
  );
};

const FootNote = ({ value }) => {
  return (
    <Box mb={80} px={32}>
      <Text letterSpacing={0.3}>{value}</Text>
    </Box>
  );
};

const ProfileBenefitDetailsModal = ({ route }) => {
  const {
    memberName,
    product,
    memberBenefit,
    externalWalletBalanceText,
    relationshipCategory,
  } = route?.params || {};

  const sections = () => {
    if (!product) {
      return [];
    }
    return product.services.map(service => ({
      title: service.name,
      data: [service],
    }));
  };
  return (
    <Box bg="gray.7" flex={1}>
      {product && sections && (
        <>
          <PanelLegendBox product={product} />
          <Box mt={80}>
            <SectionList
              ListFooterComponent={<FootNote value={product.footnote} />}
              initialNumToRender={100}
              onEndReachedThreshold={0.5}
              stickySectionHeadersEnabled
              sections={sections()}
              keyExtractor={item => item.name}
              renderSectionHeader={({ section }) => (
                <Box backgroundColor="gray.7" px={4} pb={1} pt={2}>
                  <SectionHeadingText
                    fontWeight={600}
                    fontSize={20}
                    lineHeight={24}
                    letterSpacing={0.25}
                  >
                    {section.title}
                  </SectionHeadingText>
                </Box>
              )}
              renderItem={({ item }) => {
                switch (product.productType) {
                  case WELLNESS_PRODUCT: {
                    return (
                      <WellnessServiceListItem
                        service={item}
                        memberName={memberName}
                        relationshipCategory={relationshipCategory}
                        externalWalletBalanceText={externalWalletBalanceText}
                      />
                    );
                  }
                  default: {
                    return (
                      <ServiceListItem
                        product={product}
                        service={item}
                        memberBenefit={memberBenefit}
                      />
                    );
                  }
                }
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProfileBenefitDetailsModal;
