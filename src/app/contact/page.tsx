export default function Contact() {
    return (
        <div className="max-w-2xl mx-auto p-8 text-gray-700">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">Contato</h1>

            <p className="mb-4">
                Caso tenha dúvidas, sugestões ou questões relacionadas ao CoinTracker, entre em contato conosco através
                do e-mail:
            </p>

            <p className="mb-8 text-lg font-semibold">
                📧{" "}
                <a href="mailto:suporte@cointracker.com" className="text-blue-500 underline">
                    suporte@cointracker.com
                </a>
            </p>

            <p className="text-sm text-gray-500">Respondemos normalmente em até 48 horas úteis.</p>
        </div>
    );
}
