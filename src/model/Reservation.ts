export interface ReservationRequest {
    sku: string
    requestID: string
    requester: string
    quantity: bigint
}

export interface Reservation {
    id: bigint
    requestId: string
    requester: string
    sku: string
    state: string
    reservedQuantity: bigint
    requestedQuantity: bigint
    created: Date
}
