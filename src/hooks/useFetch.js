import { useState, useEffect, useRef, useCallback } from "react";

export const useFetch = (url, method, body) => {
    const [data, setData] = useState(null);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const controllerRef = useRef(null);

    const fetchData = useCallback(async () => {
        // Toon loader
        setDataIsLoading(true);
        // Annuleer een eventueel lopend request
        if(controllerRef.current) controllerRef.current.abort();

        // Nieuwe abort controller en ref aanmaken
        const controller = new AbortController();
        const signal = controller.signal;
        controllerRef.current = controller;

        try{
            const response = method.toUpperCase() === "GET"
            ? await fetch(url, {signal: signal})
            : await fetch(url, {method: method, body: body, signal: signal});
            if(!response.ok) throw new Error("Oeps, er is iets misgegaan");
            const result = response.json();
            setError(null);
            setData(result);
        } catch(error) {
            console.log(error);
            if(error.name !== "AbortError") setError(error);
        } finally {
            setDataIsLoading(false);
        }
    });

    useEffect(() => {
        fetchData();

        // Bij een unmount of als de url, method of body veranderd
        return () => {
            if(controllerRef.current) controllerRef.current.abort();
        }
    }, [url, method, body]);

    return {data, dataIsLoading, error}
}