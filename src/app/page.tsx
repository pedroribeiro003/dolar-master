"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

type Moedas = {
    USD: { bid: string; varBid: string };
    EUR: { bid: string; varBid: string };
    BTC: { bid: string; varBid: string };
    GBP: { bid: string; varBid: string };
    JPY: { bid: string; varBid: string };
    CAD: { bid: string; varBid: string };
    ETH: { bid: string; varBid: string };
};

type DadoGrafico = { time: string; valor: number };

export default function Page() {
    const [moedas, setMoedas] = useState<Moedas | null>(null);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dadosGraficos, setDadosGraficos] = useState<{ [key: string]: DadoGrafico[] }>({});

    async function fetchData() {
        try {
            setLoading(true);

            const response = await fetch(
                "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL,GBP-BRL,JPY-BRL,CAD-BRL,ETH-BRL"
            );
            const data = await response.json();

            setMoedas({
                USD: { bid: data.USDBRL.bid, varBid: data.USDBRL.varBid },
                EUR: { bid: data.EURBRL.bid, varBid: data.EURBRL.varBid },
                BTC: { bid: data.BTCBRL.bid, varBid: data.BTCBRL.varBid },
                GBP: { bid: data.GBPBRL.bid, varBid: data.GBPBRL.varBid },
                JPY: { bid: data.JPYBRL.bid, varBid: data.JPYBRL.varBid },
                CAD: { bid: data.CADBRL.bid, varBid: data.CADBRL.varBid },
                ETH: { bid: data.ETHBRL.bid, varBid: data.ETHBRL.varBid },
            });

            const now = new Date();
            const hora = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
            const dataFormatada = now.toLocaleDateString("pt-BR");
            setUltimaAtualizacao(`${dataFormatada} ${hora}`);
        } catch (error) {
            console.error("Erro ao buscar cotação:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchHistorico(moeda: string) {
        try {
            const response = await fetch(`https://economia.awesomeapi.com.br/json/daily/${moeda}-BRL/30`);
            const data = await response.json();

            const historico = Array.isArray(data)
                ? data
                      .map((item: any) => ({
                          time: new Date(item.timestamp * 1000).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                          }),
                          valor: Number(item.bid),
                      }))
                      .reverse()
                : [];

            setDadosGraficos((prev) => ({
                ...prev,
                [moeda]: historico,
            }));
        } catch (error) {
            console.error(`Erro ao buscar histórico de ${moeda}:`, error);
        }
    }

    useEffect(() => {
        fetchData();
        const moedasParaBuscar = ["USD", "EUR", "BTC", "GBP", "JPY", "CAD", "ETH"];
        moedasParaBuscar.forEach((moeda) => fetchHistorico(moeda));

        const interval = setInterval(() => {
            fetchData();
            moedasParaBuscar.forEach((moeda) => fetchHistorico(moeda));
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    function formatarValor(valor: string) {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function corDaVariacao(variacao: string) {
        return Number(variacao) >= 0 ? "text-green-500" : "text-red-500";
    }

    function iconeVariacao(variacao: string) {
        return Number(variacao) >= 0 ? "📈" : "📉";
    }

    return (
        <div className="">
            {/* Header */}
            <header className="bg-blue-50 w-screen flex items-center justify-center px-5 border border-blue-50 h-20">
                <Image src="/logo.png" alt="CoinTracker Logo" width={250} height={100} />
            </header>

            {/* Corpo dividido em 3 colunas */}
            <div className="flex min-h-screen">
                {/* Anúncio Lateral Esquerda Sticky */}
                <aside className="hidden lg:flex w-48 justify-center p-4">
                    <div className="sticky top-24 bg-gray-200 w-40 h-[600px] rounded shadow-md flex items-center justify-center text-gray-500">
                        Anúncio
                    </div>
                </aside>

                {/* Conteúdo Principal */}
                <main className="flex-1 flex flex-col items-center p-5 text-center gap-8">
                    {moedas && (
                        <>
                            {Object.entries(moedas).map(([moeda, dados]) => (
                                <div
                                    key={moeda}
                                    className="w-full max-w-2xl flex flex-col items-center p-5 bg-white rounded-lg shadow-md"
                                >
                                    <h2 className="text-3xl font-semibold text-blue-700 mb-2">
                                        {moeda === "USD" && "💵 Dólar"}
                                        {moeda === "EUR" && "💶 Euro"}
                                        {moeda === "BTC" && "₿ Bitcoin"}
                                        {moeda === "ETH" && "Ξ Ethereum"}
                                        {moeda === "GBP" && "💷 Libra"}
                                        {moeda === "JPY" && "💴 Iene"}
                                        {moeda === "CAD" && "🇨🇦 Dólar Canadense"}
                                    </h2>

                                    <p className={`text-3xl transition duration-300 ${corDaVariacao(dados.varBid)}`}>
                                        {iconeVariacao(dados.varBid)} {formatarValor(dados.bid)}
                                    </p>

                                    {/* Gráfico */}
                                    <div className="w-full mt-6">
                                        <h3 className="text-xl font-semibold text-blue-500 mb-2">
                                            Variação (últimos 30 dias)
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={dadosGraficos[moeda] || []}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="time" />
                                                <YAxis domain={["auto", "auto"]} />
                                                <Tooltip />
                                                <Line
                                                    type="monotone"
                                                    dataKey="valor"
                                                    stroke="#2563eb"
                                                    strokeWidth={2}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Botão Atualizar Agora */}
                    <button
                        onClick={() => {
                            fetchData();
                            const moedasParaBuscar = ["USD", "EUR", "BTC", "GBP", "JPY", "CAD", "ETH"];
                            moedasParaBuscar.forEach((moeda) => fetchHistorico(moeda));
                        }}
                        className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-300 flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    ></path>
                                </svg>
                                Atualizando...
                            </>
                        ) : (
                            "Atualizar Agora"
                        )}
                    </button>

                    {/* Última atualização */}
                    {ultimaAtualizacao && (
                        <p className="text-sm text-gray-500 mt-4">Última atualização: {ultimaAtualizacao}</p>
                    )}
                </main>

                {/* Anúncio Lateral Direita Sticky */}
                <aside className="hidden lg:flex w-48 justify-center p-4">
                    <div className="sticky top-24 bg-gray-200 w-40 h-[600px] rounded shadow-md flex items-center justify-center text-gray-500">
                        Anúncio
                    </div>
                </aside>
            </div>
            <footer className="w-full bg-gray-100 border-t border-gray-300 py-6 flex flex-col items-center gap-2 text-gray-600 text-sm">
                <p>&copy; {new Date().getFullYear()} CoinTracker. Todos os direitos reservados.</p>
                <div className="flex gap-4">
                    <a href="/privacy" className="hover:text-blue-600 underline">
                        Política de Privacidade
                    </a>
                    <a href="/contact" className="hover:text-blue-600 underline">
                        Contato
                    </a>
                </div>
            </footer>
        </div>
    );
}
