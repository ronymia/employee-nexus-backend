import { registerEnumType } from '@nestjs/graphql';

export enum LocationTrackingType {
  NONE = 'NONE', // No location validation
  MANUAL = 'MANUAL', // Manual selection
  GEO_FENCING = 'GEO_FENCING', // GPS-based radius check
  IP_WHITELIST = 'IP_WHITELIST', // IP address validation
}

registerEnumType(LocationTrackingType, {
  name: 'LocationTrackingType',
  description: 'Type of location tracking for work sites',
  valuesMap: {
    NONE: {
      description: 'No location validation',
    },
    MANUAL: {
      description: 'Manual selection',
    },
    GEO_FENCING: {
      description: 'GPS-based radius check',
    },
    IP_WHITELIST: {
      description: 'IP address validation',
    },
  },
});
