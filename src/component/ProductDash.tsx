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
    const [products, setProducts] = useState<ProductInventory[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const wsInv = useRef<WebSocket | null>(null);
    const wsRes = useRef<WebSocket | null>(null);

    const fetchProducts = () => {
        let headers = new Headers();
        let auth = Buffer.from("admin:admin").toString("base64");
        headers.append("Authorization", "Basic " + auth);

        fetch("http://localhost:8080/api/v1/inventory", { method: "GET", headers: headers })
            .then(res => res.json())
            .then(
                (result) => {
                    setProducts(result);
                },
                (error) => {
                    setError(error);
                }
            )
    }

    const fetchReservations = () => {
        let headers = new Headers();
        let auth = Buffer.from("admin:admin").toString("base64");
        headers.append("Authorization", "Basic " + auth);

        fetch("http://localhost:8080/api/v1/reservation", { method: "GET", headers: headers })
            .then(res => res.json())
            .then(
                (result) => {
                    setReservations(result);
                },
                (error) => {
                    setError(error);
                }
            )
    }

    const handleSubmit = (product: Product) => {
        fetchProducts();
    }

    useEffect(() => {
        fetchProducts();
        fetchReservations();
        
        wsInv.current = new WebSocket('ws://localhost:8080/api/v1/inventory/subscribe');
        wsInv.current.onclose = (event) => console.log('subscription to inventory closed');

        wsRes.current = new WebSocket('ws://localhost:8080/api/v1/reservation/subscribe');
        wsRes.current.onclose = (event) => console.log('subscription to reservations closed');
    }, []);

    useEffect(() => {
        if (wsInv.current) {
            wsInv.current.onmessage = e => {
                console.log("received product message");
                const product = JSON.parse(e.data);
                const idx = products.findIndex((p) => p.sku === product.sku);
                let updatedProducts = [...products] as ProductInventory[];
    
                if (idx === -1) {
                    updatedProducts.push(product);
                } else {
                    updatedProducts[idx] = product;
                }

                console.log("updated products", updatedProducts);
                setProducts(updatedProducts);
            };
        }
        if (wsRes.current) {
            wsRes.current.onmessage = e => {
                console.log("received reservation message");
                const reservation = JSON.parse(e.data);
                const idx = reservations.findIndex((r) => r.id === reservation.id);
                let updatedReservations = [...reservations] as Reservation[];
    
                if (idx === -1) {
                    updatedReservations.push(reservation);
                } else {
                    updatedReservations[idx] = reservation;
                }

                console.log("updated reservations", updatedReservations);
                setReservations(updatedReservations);
            };
        }
        
    });

    if (error) {
        return <div>Error: {error.error}</div>;
    } else {
        return (
            <>
                <ProductForm product={{} as Product} onSave={handleSubmit} />
                <ProductList products={products} />
                <CurrentInventory products={products} reservations={reservations} />
                <ReservationList reservations={reservations} />
            </>
        );
    }
}

export default ProductDash;