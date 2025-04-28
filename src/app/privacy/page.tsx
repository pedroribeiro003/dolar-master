export default function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto p-8 text-justify text-gray-700">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">Política de Privacidade</h1>

            <p className="mb-4">
                A sua privacidade é importante para nós. É política do CoinTracker respeitar a sua privacidade em
                relação a qualquer informação sua que possamos coletar no site CoinTracker.
            </p>

            <p className="mb-4">
                Utilizamos serviços de terceiros, como o Google AdSense, que podem coletar dados para personalizar
                anúncios. Estes serviços utilizam cookies para coletar informações como IP, localização, navegador e
                sistema operacional.
            </p>

            <p className="mb-4">
                Você pode optar por desativar os cookies nas configurações do seu navegador, ou através de ferramentas
                específicas de gerenciamento de cookies.
            </p>

            <p className="mb-4">
                Ao continuar usando o nosso site, você concorda com nossa política de privacidade e o uso de cookies
                para a melhor experiência de navegação.
            </p>

            <p className="mt-6">
                Para mais informações sobre cookies e publicidade personalizada, recomendamos visitar a{" "}
                <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                >
                    Política de Privacidade do Google
                </a>
                .
            </p>
        </div>
    );
}
