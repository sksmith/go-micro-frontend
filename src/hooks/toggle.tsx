import { useEffect } from 'react';

const addDocumentClass = (className: any) => document.documentElement.classList.add(className);
const removeDocumentClass = (className: any) => document.documentElement.classList.remove(className);

export default function useDocumentClass(className: string[]) {
    useEffect(
        () => {
            // Set up
            className instanceof Array ? className.map(addDocumentClass) : addDocumentClass(className);

            // Clean up
            return () => {
                className instanceof Array
                    ? className.map(removeDocumentClass)
                    : removeDocumentClass(className);
            };
        },
        [className]
    );
}