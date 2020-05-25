export const TERMINATED = 'terminated';

export const isTerminatedOrExtended = status => {
  return status && status.toLowerCase() === TERMINATED;
};

export const isOnExtendedTime = limitedAccessUntil => {
  if (!limitedAccessUntil || isNaN(new Date(limitedAccessUntil).getTime()))
    return false;
  return new Date().getTime() < new Date(limitedAccessUntil).getTime();
};
