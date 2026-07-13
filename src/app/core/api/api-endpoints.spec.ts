import { describe, expect, it } from 'vitest';

import { ActionTypes } from '@nexacore/api-common';
import { ApiEndpoints } from './api-endpoints';

describe('ApiEndpoints', () => {
  it('keeps KYC and person endpoints available for app services', () => {
    expect(ApiEndpoints.KYC_SEARCH.actionType).toBe(ActionTypes.SEARCH);
    expect(ApiEndpoints.PERSON_CREATE.isMultiPart).toBe(true);
    expect(ApiEndpoints.PERSON_PHOTO.apiPath).toBe('v1/person/photo');
  });
});
