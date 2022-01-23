import { Reservation } from "../model/Reservation";
import { Badge, BadgeColor, BadgeSize } from "./element/Badge";

interface ReservationListProps {
    reservations: Reservation[]
}

const ReservationList = ({ reservations }: ReservationListProps) => {
    return (
        <>
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow-md sm:rounded-lg">
                    <table className="min-w-full">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    ID
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    Request ID
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    Requester
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    SKU
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    State
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    Reserved
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    Requested
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400">
                                    Created
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reservations.map((reservation) => (
                                <tr key={Number(reservation.id)} className="border-b odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 dark:border-gray-600">
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {reservation.id}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        {reservation.requestId}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        {reservation.requester}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        {reservation.sku}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        <Badge size={BadgeSize.Small} color={reservation.state === "Open" ? BadgeColor.Red : BadgeColor.Green} value={reservation.state} />
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        {reservation.reservedQuantity}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        {reservation.requestedQuantity}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                        {reservation.created}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ReservationList;