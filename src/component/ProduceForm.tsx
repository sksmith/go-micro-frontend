import React from 'react';
import { Product } from '../model/Product'

interface ProductProps {
    product: Readonly<Product>;
}

const ProduceForm = ({ product }: ProductProps) => {
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        setTimeout(() => {
            alert(JSON.stringify({ ...product, ...data, created: new Date() }));
            setLoading(false);
        }, 500);
    };

    return (
        <div className="w-full max-w-xs p-8 space-x-4">
            <h2>Produce {product.name}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
            </form>
        </div>
    );
};

export default ProduceForm;