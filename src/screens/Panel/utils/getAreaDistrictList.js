const extractAreaDistrict = clinics => {
  let areaDistrictList = [];
  let areas = new Set();
  clinics.forEach(clinic => clinic.area && areas.add(clinic.area.trim()));
  areas.forEach(title => areaDistrictList.push({ title, district: new Set() }));
  clinics.forEach(clinic => {
    const areaDistricts = areaDistrictList.find(
      areaDistrict => areaDistrict.title === clinic.area.trim(),
    );
    clinic.district && areaDistricts.district.add(clinic.district.trim());
  });

  return areaDistrictList
    .map(areaDistrict => {
      return {
        title: areaDistrict.title,
        data: Array.from(areaDistrict.district).sort(),
      };
    })
    .sort((areaDistrictA, areaDistrictB) => {
      if (areaDistrictA.title < areaDistrictB.title) return -1;
      if (areaDistrictA.title > areaDistrictB.title) return 1;
      return 0;
    });
};

const addAreaSection = (areaDistrictList, intl) => {
  areaDistrictList.unshift({
    title: intl.formatMessage({
      id: 'panelSearch.search.areas',
    }),
    data: Array.from(areaDistrictList, areaDistrict => areaDistrict.title),
  });
};

const addAreaLabel = (areaDistrictList, intl) => {
  return areaDistrictList.map(areaDistrict => {
    if (
      areaDistrict.title !==
      intl.formatMessage({ id: 'panelSearch.search.areas' })
    ) {
      return {
        ...areaDistrict,
        title: `${intl.formatMessage({
          id: 'panelSearch.search.districts',
        })} - ${areaDistrict.title}`,
      };
    }
    return areaDistrict;
  });
};

export const getAreaDistrictList = (intl, clinics) => {
  let areaDistrictList = extractAreaDistrict(clinics);
  if (areaDistrictList.length > 0) {
    addAreaSection(areaDistrictList, intl);
    areaDistrictList = addAreaLabel(areaDistrictList, intl);
  }
  return areaDistrictList;
};
