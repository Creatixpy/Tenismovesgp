import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Sobre() {
  const valores = [
    {
      titulo: "Qualidade",
      descricao: "Selecionamos apenas os melhores produtos com garantia de qualidade e durabilidade.",
      icone: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      titulo: "Inovação",
      descricao: "Buscamos constantemente as últimas tendências e tecnologias em calçados esportivos.",
      icone: "M13 10V3L4 14h7v7l9-11h-7z"
    },
    {
      titulo: "Sustentabilidade",
      descricao: "Comprometidos com práticas sustentáveis e materiais eco-friendly sempre que possível.",
      icone: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    },
    {
      titulo: "Atendimento",
      descricao: "Oferecemos um atendimento personalizado e especializado para cada cliente.",
      icone: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    }
  ];

  const equipe = [
    {
      nome: "Gabriel Silva",
      cargo: "Fundador & CEO",
      descricao: "Apaixonado por tênis há mais de 15 anos, Gabriel fundou a TenisMoveSGP com o objetivo de democratizar o acesso a produtos de qualidade."
    },
    {
      nome: "Ana Costa",
      cargo: "Diretora de Produto",
      descricao: "Especialista em tendências de moda e calçados, Ana garante que nossa coleção esteja sempre atualizada com as últimas novidades."
    },
    {
      nome: "Carlos Mendes",
      cargo: "Gerente de Vendas",
      descricao: "Com experiência de 10 anos no varejo, Carlos lidera nossa equipe de vendas com foco na satisfação do cliente."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Sobre Nós
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conheça a história da TenisMoveSGP, nossa missão e os valores que nos guiam
              em cada passo da jornada para oferecer os melhores tênis do mercado.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  A TenisMoveSGP nasceu em 2020 com um sonho simples: tornar tênis de alta qualidade
                  acessíveis a todos os brasileiros. Tudo começou quando nosso fundador, Gabriel Silva,
                  percebeu uma lacuna no mercado brasileiro de calçados esportivos.
                </p>
                <p>
                  Após anos trabalhando no ramo de varejo, Gabriel identificou que muitos consumidores
                  tinham dificuldade em encontrar produtos de qualidade com bom atendimento e preços justos.
                  Foi então que surgiu a ideia da TenisMoveSGP.
                </p>
                <p>
                  Hoje, somos referência no mercado brasileiro, com mais de 500 produtos em catálogo,
                  milhares de clientes satisfeitos e uma equipe apaixonada por tênis e atendimento ao cliente.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">2020</div>
                  <div className="text-gray-600">Ano de fundação</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-gray-600">Produtos</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">10k+</div>
                  <div className="text-gray-600">Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">15</div>
                  <div className="text-gray-600">Estados atendidos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Os princípios que nos guiam e definem nossa relação com clientes, parceiros e comunidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={valor.icone} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{valor.titulo}</h3>
                <p className="text-gray-600 text-sm">{valor.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Equipe</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça as pessoas por trás da TenisMoveSGP, nossa equipe apaixonada e dedicada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipe.map((membro, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{membro.nome}</h3>
                <p className="text-blue-600 font-medium mb-4">{membro.cargo}</p>
                <p className="text-gray-600 text-sm">{membro.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-600">
                Oferecer tênis de alta qualidade com atendimento excepcional,
                tornando produtos premium acessíveis a todos os brasileiros.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-600">
                Ser a principal referência em e-commerce de tênis no Brasil,
                reconhecida pela qualidade e inovação.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Valores</h3>
              <p className="text-gray-600">
                Integridade, inovação, sustentabilidade e compromisso com a
                satisfação total de nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
