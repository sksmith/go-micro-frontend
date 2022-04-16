import { useState } from 'react';
import { Product } from '../model/Product';
import { Error } from '../model/Error';
import { Buffer } from "buffer";
import { useForm } from "react-hook-form";

interface ProductProps {
    onSave: (product: Product) => void;
    product: Product;
}

const ProductForm = ({ onSave, product }: ProductProps) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();

    let headers = new Headers();
    let auth = Buffer.from("admin:admin").toString("base64");
    headers.append("Authorization", "Basic " + auth);

    const onSubmit = async (data: any) => {
        setLoading(true);
        reset();
        fetch("http://localhost:8080/api/v1/inventory", { method: "PUT", headers: headers, body: JSON.stringify(data) })
            .then(res => res.json())
            .then(
                (result) => {
                    setLoading(false);
                    onSave(product);
                },
                (error) => {
                    setLoading(false);
                    setError(error);
                }
            );
    };

    return (
        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-md sm:rounded-lg">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2 sm:p-6 dark:bg-gray-800">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name</label>
                            <input {...register("name")} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="sku" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">SKU</label>
                            <input {...register("sku")} id="sku" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="upc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">UPC</label>
                            <input {...register("upc")} id="upc" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;