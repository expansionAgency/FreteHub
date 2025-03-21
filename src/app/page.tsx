import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">FreteHub</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/#como-funciona" className="text-secondary hover:text-primary">
              Como Funciona
            </Link>
            <Link href="/#para-quem" className="text-secondary hover:text-primary">
              Para Quem
            </Link>
            <Link href="/#beneficios" className="text-secondary hover:text-primary">
              Benefícios
            </Link>
          </div>
          <div className="flex space-x-3">
            <Link href="/entrar" className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-secondary transition-colors">
              Entrar
            </Link>
            <Link href="/cadastro" className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-primary/90 transition-colors">
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Conectamos embarcadores e transportadores de todo o Brasil
                </h1>
                <p className="text-xl mb-8">
                  Plataforma que simplifica a cotação, contratação e gerenciamento de fretes. 
                  Economize tempo e dinheiro enquanto nós cuidamos de toda a logística.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/cadastro?tipo=embarcador" className="px-6 py-3 bg-background text-secondary rounded-md font-medium text-center hover:bg-background/90 transition-colors">
                    Sou Embarcador
                  </Link>
                  <Link href="/cadastro?tipo=transportador" className="px-6 py-3 bg-transparent border-2 border-secondary rounded-md font-medium text-center hover:bg-secondary hover:text-primary transition-colors">
                    Sou Transportador
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md h-80">
                  <div className="absolute inset-0 bg-secondary/20 rounded-lg backdrop-blur-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">+5.000</div>
                      <div className="text-xl">Transportadores</div>
                      <div className="my-6 border-t border-secondary/30"></div>
                      <div className="text-5xl font-bold mb-2">+1.200</div>
                      <div className="text-xl">Embarcadores</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section id="como-funciona" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-secondary">Como Funciona</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-secondary p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-3 text-background">Cadastre-se</h3>
                <p className="text-background">
                  Escolha seu perfil: embarcador ou transportador. Preencha seus dados e comece a usar nossa plataforma.
                </p>
              </div>
              <div className="bg-secondary p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-3 text-background">Publique ou Busque Cargas</h3>
                <p className="text-background">
                  Embarcadores podem publicar cargas com detalhes completos. Transportadores encontram fretes disponíveis.
                </p>
              </div>
              <div className="bg-secondary p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-3 text-background">Negocie e Rastreie</h3>
                <p className="text-background">
                  Faça negociações diretas, acompanhe a carga em tempo real e realize pagamentos de forma segura.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Para Quem */}
        <section id="para-quem" className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-background">Para Quem é o FreteHub?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background p-8 rounded-lg shadow-sm border border-secondary/10">
                <h3 className="text-2xl font-semibold mb-4 text-primary">Embarcadores</h3>
                <ul className="space-y-3 text-secondary">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Empresas que precisam transportar produtos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Indústrias com demanda logística</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>E-commerces com envios frequentes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Distribuidores e atacadistas</span>
                  </li>
                </ul>
              </div>
              <div className="bg-background p-8 rounded-lg shadow-sm border border-secondary/10">
                <h3 className="text-2xl font-semibold mb-4 text-primary">Transportadores</h3>
                <ul className="space-y-3 text-secondary">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Caminhoneiros autônomos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Empresas de transporte de cargas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Operadores logísticos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Frotas terceirizadas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section id="beneficios" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-secondary">Nossos Benefícios</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 bg-secondary rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-background">Economia</h3>
                <p className="text-background">Redução de custos operacionais com nossa plataforma inteligente de negociação de fretes.</p>
              </div>
              <div className="p-5 bg-secondary rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-background">Agilidade</h3>
                <p className="text-background">Fechamento de fretes em minutos com nossa interface intuitiva e conexão direta entre as partes.</p>
              </div>
              <div className="p-5 bg-secondary rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-background">Segurança</h3>
                <p className="text-background">Verificação de documentos, avaliações e sistema de pagamento protegido para todas as operações.</p>
              </div>
              <div className="p-5 bg-secondary rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-background">Transparência</h3>
                <p className="text-background">Orçamentos claros, sem custos ocultos e com rastreamento em tempo real de todas as operações.</p>
              </div>
              <div className="p-5 bg-secondary rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-background">Praticidade</h3>
                <p className="text-background">Gerencie toda a operação em uma única plataforma, desde a cotação até o pagamento e avaliação.</p>
              </div>
              <div className="p-5 bg-secondary rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-background">Crescimento</h3>
                <p className="text-background">Aumente sua rede de contatos e oportunidades com nossa ampla comunidade de parceiros logísticos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para revolucionar sua logística?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Junte-se a milhares de embarcadores e transportadores que já estão economizando tempo e dinheiro com o FreteHub.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/cadastro" className="px-8 py-3 bg-background text-secondary rounded-md font-medium hover:bg-background/90 transition-colors">
                Criar Conta Grátis
              </Link>
              <Link href="/contato" className="px-8 py-3 bg-transparent border-2 border-secondary rounded-md font-medium hover:bg-secondary hover:text-primary transition-colors">
                Falar com Consultor
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background text-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary">FreteHub</h3>
              <p className="text-secondary/80 mb-4">Conectando o Brasil através da logística inteligente.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-secondary/80 hover:text-primary">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-secondary/80 hover:text-primary">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-secondary/80 hover:text-primary">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/quem-somos" className="text-secondary/80 hover:text-primary">Quem Somos</Link></li>
                <li><Link href="/como-funciona" className="text-secondary/80 hover:text-primary">Como Funciona</Link></li>
                <li><Link href="/para-embarcadores" className="text-secondary/80 hover:text-primary">Para Embarcadores</Link></li>
                <li><Link href="/para-transportadores" className="text-secondary/80 hover:text-primary">Para Transportadores</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Suporte</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-secondary/80 hover:text-primary">Perguntas Frequentes</Link></li>
                <li><Link href="/contato" className="text-secondary/80 hover:text-primary">Contato</Link></li>
                <li><Link href="/termos" className="text-secondary/80 hover:text-primary">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="text-secondary/80 hover:text-primary">Política de Privacidade</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Contato</h3>
              <ul className="space-y-2 text-secondary/80">
                <li>contato@fretehub.com.br</li>
                <li>(11) 99999-9999</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-secondary/20 text-center text-secondary/60">
            <p>© {new Date().getFullYear()} FreteHub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 