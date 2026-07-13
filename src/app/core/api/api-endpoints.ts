import {ActionTypes, ApiEndpoint} from "@nexacore/api-common";

export const ApiEndpoints = {
    // KYC
    KYC_CREATE: { service: 'KYC', apiPath: 'kyc/create', actionType: ActionTypes.CREATE, isMultiPart: true },
    KYC_UPDATE: { service: 'KYC', apiPath: 'kyc/update', actionType: ActionTypes.UPDATE, isMultiPart: true },
    KYC_DELETE: { service: 'KYC', apiPath: 'kyc/delete', actionType: ActionTypes.DELETE },
    KYC_SEARCH: { service: 'KYC', apiPath: 'kyc/search', actionType: ActionTypes.SEARCH },
    KYC_GET: { service: 'KYC', apiPath: 'kyc/get-by-id', actionType: ActionTypes.SEARCH },

    // Authentication
    KYC_LOGIN: { service: 'LOGIN', apiPath: 'auth/authenticate', actionType: ActionTypes.LOGIN },
    PRIVILEGE_CONTEXT: { service: 'SYSTEM', apiPath: 'system/privilege/context', actionType: ActionTypes.AUTH },
    PRIVILEGE_SIDEBAR_MENU: { service: 'SYSTEM', apiPath: 'system/privilege/sidebar-menu', actionType: ActionTypes.AUTH },

    PERSON_CREATE: { service: 'PERSON', apiPath: 'v1/person/create', actionType: ActionTypes.CREATE, isMultiPart: true },
    PERSON_UPDATE: { service: 'PERSON', apiPath: 'v1/person/update', actionType: ActionTypes.UPDATE, isMultiPart: true },
    PERSON_SEARCH: { service: 'PERSON', apiPath: 'v1/person/search', actionType: ActionTypes.SEARCH },
    PERSON_DELETE: { service: 'PERSON', apiPath: 'v1/person/delete', actionType: ActionTypes.DELETE },
    PERSON_PHOTO: { service: 'PERSON', apiPath: 'v1/person/photo', actionType: ActionTypes.SEARCH },

    GIS_SEARCH: { service: 'GIS', apiPath: 'locations/search', actionType: ActionTypes.SEARCH },
    GIS_GET_BY_ID: { service: 'GIS', apiPath: 'locations/get-by-id', actionType: ActionTypes.SEARCH },

} satisfies Record<string, ApiEndpoint>;
