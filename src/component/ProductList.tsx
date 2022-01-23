import { useState } from "react"
import { Product, ProductInventory, ProductionEvent } from "../model/Product"
import Modal from "./element/Modal"
import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";
import { ReservationRequest } from "../model/Reservation";
import { Badge, BadgeColor, BadgeSize } from "./element/Badge";

interface ProductListProps {
    products: ProductInventory[]
}

const ProductList = ({ products }: ProductListProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();
    const [showProduceModal, setShowProduceModal] = useState(false);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({} as Product);
    const [quantity, setQuantity] = useState(BigInt(0));

    let headers = new Headers();
    let auth = Buffer.from("admin:admin").toString("base64");
    headers.append("Authorization", "Basic " + auth);

    const handleFocus = (event: any) => event.target.select();

    const handleProduceQuantityKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            produceSelectedProduct();
        } else if (event.key === 'Escape') {
            clearProduceModal();
        }
    }

    const handleReserveQuantityKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            reserveSelectedProduct();
        } else if (event.key === 'Escape') {
            clearReserveModal();
        }
    }

    const produceSelectedProduct = () => {
        produce(selectedProduct, quantity);
        clearProduceModal();
    }

    const reserveSelectedProduct = () => {
        reserve(selectedProduct, quantity);
        clearReserveModal();
    }

    const clearProduceModal = () => {
        setQuantity(BigInt(0));
        setShowProduceModal(false);
    }

    const clearReserveModal = () => {
        setQuantity(BigInt(0));
        setShowReserveModal(false);
    }

    const produce = (product: Product, quantity: bigint) => {
        const event: ProductionEvent = {
            requestId: uuidv4(),
            sku: product.sku,
            quantity: quantity,
            created: new Date(),
        }

        sendProductionEvent(event);
    };

    const reserve = (product: Product, quantity: bigint) => {
        const request: ReservationRequest = {
            requestID: uuidv4(),
            sku: product.sku,
            requester: "Sean",
            quantity: quantity,
        }
        sendReservationRequest(request);
    }

    const sendProductionEvent = async (event: ProductionEvent) => {
        setLoading(true);
        const url = "http://localhost:8080/api/v1/inventory/" + event.sku + "/productionEvent";
        const json = JSON.stringify(event, (key, value) =>
            typeof value === 'bigint'
                ? Number(value)
                : value
        );

        setTimeout(() => {
            fetch(url, { method: "PUT", headers: headers, body: json })
                .then(res => res.json())
                .then(
                    (result) => {
                        setLoading(false);
                    },
                    (error) => {
                        setLoading(false);
                        setError(error);
                    }
                );
        }, 500);
    }

    const sendReservationRequest = async (request: ReservationRequest) => {
        setLoading(true);
        const url = "http://localhost:8080/api/v1/reservation";
        const json = JSON.stringify(request, (key, value) =>
            typeof value === 'bigint'
                ? Number(value)
                : value
        );

        setTimeout(() => {
            fetch(url, { method: "PUT", headers: headers, body: json })
                .then(res => res.json())
                .then(
                    (result) => {
                        setLoading(false);
                    },
                    (error) => {
                        setLoading(false);
                        setError(error);
                    }
                );
        }, 500);
    }

    return (
        <>
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow-md sm:rounded-lg">
                    <table className="min-w-full">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    Name
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    SKU
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    UPC
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    Available
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    Manage Inventory
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.sku} className="border-b odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 dark:border-gray-600">
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {product.name}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        {product.sku}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        {product.upc}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        <Badge size={BadgeSize.Base} color={product.available > 0 ? BadgeColor.Green : BadgeColor.Red} value={product.available.toString()} />
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        <button type="button" onClick={() => { setSelectedProduct(product); setShowProduceModal(true); }} className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Produce</button>
                                        <button type="button" onClick={() => { setSelectedProduct(product); setShowReserveModal(true); }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Reserve</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showProduceModal ? (
                <Modal title={"Produce " + selectedProduct.name} cancelHandler={clearProduceModal} submitHandler={produceSelectedProduct}>
                    <div className="m-6">
                        <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Quantity</label>
                        <input id="name" autoFocus onFocus={handleFocus} onKeyDown={handleProduceQuantityKeyDown} value={Number(quantity)} onChange={(e) => setQuantity(BigInt(e.target.value))}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                </Modal>
            ) : null}
            {showReserveModal ? (
                <Modal title={"Reserve " + selectedProduct.name} cancelHandler={clearReserveModal} submitHandler={reserveSelectedProduct}>
                    <div className="m-6">
                        <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Quantity</label>
                        <input id="name" autoFocus onFocus={handleFocus} onKeyDown={handleReserveQuantityKeyDown} value={Number(quantity)} onChange={(e) => setQuantity(BigInt(e.target.value))}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                </Modal>
            ) : null}
        </>
    );
}

export default ProductList;