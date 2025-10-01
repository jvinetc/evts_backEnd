export interface IStopResponseCircuit {
    id?: string;
    address?: {
        address?: string;
        addressLineOne?: string;
        addressLineTwo?: string;
        latitude?: number;
        longitude?: number;
        placeId?: string;
        placeTypes?: [
            string
        ]
    };
    barcodes?: [];
    driverIdentifier?: string;
    allowedDriversIdentifiers?: string[];
    notes?: string;
    packageCount?: number;
    type?: string;
    packageLabel?: number;
    stopPosition?: number;
    orderInfo?: {
        products?: [];
        sellerName?: string;
        sellerOrderId?: string;
        sellerWebsite?: string;
    };
    placeInVehicle?: number;
    recipient?: {
        name?: string;
        email?: string;
        phone?: string;
        externalId?: number;
    };
    deliveryInfo?: {
        attempted?: boolean;
        attemptedAt?: number;
        attemptedLocation?: {
            latitude?: number;
            longitude?: number;
        };
        driverProvidedInternalNotes?: string;
        driverProvidedRecipientNotes?: string;
        photoUrls?: string[];
        succeeded?: boolean;
        state?: string;
    };
    proofOfAttemptRequirements?: {
        enabled?: null
    };
    plan?: string;
    route?: {
        id?: string;
        title?: string;
        stopCount?: number;
        driver?: string;
        state?: {
            completed?: boolean;
            completedAt?: null;
            distributed?: boolean;
            distributedAt?: number;
            notifiedRecipients?: boolean;
            notifiedRecipientsAt?: number;
            started?: boolean;
            startedAt?: number;
        };
        plan?: string;
    };
    customProperties?: null;
    circuitClientId?: null;
    activity?: string
}

export interface IStopsResponse {
    stops?: IStopResponseCircuit[]
    nextPageToken?: string;
}

export interface IStopCreate {
    address?: {
        addressName?: string;
        addressLineOne?: string;
        addressLineTwo?: string;
    };
    recipient?: {
        externalId?: string;
        email?: string;
        phone?: string;
        name?: string
    };
    driver?: string;
    allowedDrivers?: string[];
    activity?: string;
    packageCount?: number;
    notes?: string;
}

export interface IResponseBulk {
    success?: string[];
    failed?: [
        {
            error?: {
                message?: string
            };
            stop?: {
                address?: {
                    addressName?: string;
                    addressLineOne?: string;
                    addressLineTwo?: string;
                    city?: string;
                    state?: string;
                    zip?: string;
                    country?: string;
                    latitude?: number;
                    longitude?: number;
                };
                recipient?: {
                    externalId?: string;
                    email?: string;
                    phone?: string;
                    name?: string
                }
            }
        }
    ]
}

export interface IResponseWebhook {
    type: string,
    version: string;
    created: number;
    data: IStopResponseCircuit;
    raw: string;
}