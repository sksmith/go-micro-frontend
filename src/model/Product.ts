export interface Product {
    sku: string
    upc: string
    name: string
}

export interface ProductInventory extends Product {
    available: bigint
}

export interface ProductionEvent {
    requestId: string
    sku: string
    quantity: bigint
    created: Date
}