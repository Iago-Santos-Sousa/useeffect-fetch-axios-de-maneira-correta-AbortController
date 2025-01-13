"use client";
import { useState, useEffect, useRef, JSX } from "react";
import api from "@/services/api";

type Posts = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Maneira 1 - Dentro do useEffect
/*
const Component = (): JSX.Element => {
  "use client";
  const [data, setData] = useState<Posts[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const handleFetch = async (): Promise<void> => {
      try {
        const response = await api.get<Posts[]>("/posts", {
          signal: controller.signal,
        });
        setData(response.data);
      } catch (error: unknown) {
        console.log(error);
      }
    };

    handleFetch();

    return () => {
      console.log("Cancelando requisição ao desmontar componente...");
      controller.abort();
    };
  }, []);

  console.log("Montou componente");

  return (
    <div className="container">
      <p>Componente</p>
      {data.map((e, i) => (
        <div key={i} className="mb-3">
          <p>{e.body}</p>
        </div>
      ))}
    </div>
  );
};
*/

// Maneira 2 - Fora do useEffect
const Component = (): JSX.Element => {
  "use client";
  const [data, setData] = useState<Posts[]>([]);
  const controllerRef = useRef<AbortController>(null!);

  const handleFetch = async (): Promise<void> => {
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      const response = await api.get<Posts[]>("/posts", {
        signal: signal,
      });
      setData(response.data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetch();

    return () => {
      console.log("Cancelando requisição ao desmontar componente...");
      controllerRef.current.abort();
    };
  }, []);

  console.log("Montou componente");

  return (
    <div className="container">
      <p>Componente</p>
      {data.map((e, i) => (
        <div key={i} className="mb-3">
          <p>{e.body}</p>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={() => setIsVisible((prev) => !prev)}>Click</button>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {isVisible && <Component />}
      </main>
    </div>
  );
}
