import { useEffect, useState, useRef } from "react"
import { ProductInventory, Product } from "../model/Product"
import { Reservation } from "../model/Reservation"
import CurrentInventory from "./CurrentInventory"
import ProductList from "./ProductList"
import ReservationList from "./ReservationList"
import { Buffer } from "buffer";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
} from "chart.js";
import ProductForm from "./ProductForm"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface ErrorResponse {
    status: string
    code: number
    error: string
}

const ProductDash = () => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [isFetchingInventory, setIsFetchingInventory] = useState(false);
    const [isFetchingReservations, setIsFetchingReservations] = useState(false);
    const [products, setProducts] = useState<ProductInventory[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const ws = useRef<WebSocket | null>(null);

    let headers = new Headers();
    let auth = Buffer.from("admin:admin").toString("base64");
    headers.append("Authorization", "Basic " + auth);

    function useInterval(callback: () => any) {
        const savedCallback = useRef<() => any>();

        useEffect(() => {
            savedCallback.current = callback;
        });

        useEffect(() => {
            function tick() {
                if (savedCallback.current) {
                    savedCallback.current();
                }
            }

            let id = setInterval(tick, 250);
            return () => clearInterval(id);
        }, []);
    }

    useEffect(() => {
        FetchInventory();
        FetchReservations();
        SubscribeInventory();
    }, []);

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = e => {
            const product = JSON.parse(e.data);
            const idx = products.findIndex((p) => p.sku === product.sku);
            let updatedProducts = [...products] as ProductInventory[];

            if (idx === -1) {
                updatedProducts.push(product);
            } else {
                updatedProducts[idx] = product;
            }

            console.log("products", products);
            console.log("updated products", updatedProducts);
            setProducts(updatedProducts);
        };
    });

    const SubscribeInventory = () => {
        ws.current = new WebSocket('ws://localhost:8080/api/v1/inventory/subscribe');
        ws.current?.addEventListener('open', (event) => ws.current?.send('Hello Server!'));
        ws.current?.addEventListener('close', (event) => console.log('The connection has been closed'));
    }

    const FetchInventory = () => {
        if (isFetchingInventory) return;
        setIsFetchingInventory(true);

        fetch("http://localhost:8080/api/v1/inventory", { method: "GET", headers: headers })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsFetchingInventory(false);
                    setProducts(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsFetchingInventory(false);
                    setError(error);
                }
            )
    }

    const FetchReservations = () => {
        if (isFetchingReservations) return;
        setIsFetchingReservations(true);

        fetch("http://localhost:8080/api/v1/reservation", { method: "GET", headers: headers })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsFetchingReservations(false);
                    setReservations(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsFetchingReservations(false);
                    setError(error);
                }
            )
    }

    // useInterval(FetchInventory)
    // useInterval(FetchReservations)

    if (error) {
        return <div>Error: {error.error}</div>;
    } else {
        return (
            <>
                <ProductForm product={{} as Product} />
                <ProductList products={products} />
                <CurrentInventory products={products} reservations={reservations} />
                <ReservationList reservations={reservations} />
            </>
        );
    }
}

export default ProductDash;