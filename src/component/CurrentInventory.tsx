import { Reservation } from "../model/Reservation";
import { ProductInventory } from "../model/Product"
import { Bar } from "react-chartjs-2"
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    Plugin,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
Chart.defaults.color = "rgb(156 163 175)";
Chart.defaults.font.size = 12;
Chart.defaults.font.weight = "550";

interface CurrentInventoryProps {
    products: ProductInventory[],
    reservations: Reservation[],
}

const CurrentInventory = ({ products, reservations }: CurrentInventoryProps) => {

    const plugin: Plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart: any) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.fillStyle = 'rgb(31 41 55)';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    const prodavl: number[] = products.map((v) => Number(v.available));
    const prodres: number[] = [];

    products.forEach(product => {
        prodres.push(reservations
            .filter(res => res.sku === product.sku)
            .filter(res => res.state === "Open")
            .map(res => Number(res.requestedQuantity - res.reservedQuantity))
            .reduce((a, b) => a + b, Number(0)));
    });

    const data = {
        labels: products.map((v) => v.name),
        datasets: [
            {
                label: "Available Inventory",
                data: prodavl,
                fill: true,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: "Open Reservations",
                data: prodres,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: "Current Inventory",
                font: {
                    size: 24
                }
            }
        }
    }

    return (
        <>
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow-md sm:rounded-lg">
                    <Bar data={data} plugins={[plugin]} options={options} />
                </div>
            </div>
        </>
    );
}

export default CurrentInventory;