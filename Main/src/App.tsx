import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Zap, Monitor, Code, Github, Search, ArrowRight, Menu, X } from 'lucide-react';
import Scripts from './pages/Scripts';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredExecutors = executors.filter(executor =>
    executor.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-emerald-800/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="fixed top-4 right-4 z-30 lg:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-20 bg-black/90 backdrop-blur-xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <img src="https://cdn.discordapp.com/attachments/1302539586534113312/1329107235367944272/icon_games.png?ex=67ffca12&is=67fe7892&hm=76e84dee58de09b38e2186280896cb835db415f9076a4a7c7c3e1149972456e5&" alt="Game Icon" className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Destroyer Hub
                </span>
              </Link>
              <button 
                onClick={toggleMobileMenu}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 mt-6">
              <Link 
                to="/" 
                className="flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Monitor className="w-5 h-5" />
                Executores
              </Link>
              <Link 
                to="/scripts" 
                className="flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Code className="w-5 h-5" />
                Scripts
              </Link>
            </nav>
            
            <div className="mt-auto">
              <a
                href="https://github.com/iUnknownBr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm font-medium">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-full w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 z-20 hidden lg:block">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="https://cdn.discordapp.com/attachments/1302539586534113312/1329107235367944272/icon_games.png?ex=67ffca12&is=67fe7892&hm=76e84dee58de09b38e2186280896cb835db415f9076a4a7c7c3e1149972456e5&" alt="Game Icon" className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Destroyer Hub
              </span>
            </Link>
          </div>

          <nav className="mt-6">
            <Link to="/" className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-white/70 hover:text-white hover:bg-white/5">
              <Monitor className="w-5 h-5" />
              Executores
            </Link>
            <Link to="/scripts" className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-white/70 hover:text-white hover:bg-white/5">
              <Code className="w-5 h-5" />
              Scripts
            </Link>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <a
              href="https://github.com/iUnknownBr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:pl-64">
          <Routes>
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/" element={
              <div className="min-h-screen p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                  {/* Hero Section */}
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        Destroyer Hub
                      </span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
                      Sua fonte confiável de scripts e executores para jogos. Atualizados diariamente com as melhores opções disponíveis.
                    </p>
                    <div className="max-w-xl mx-auto relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                      <input
                        type="search"
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-md pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-green-500"
                        placeholder="Buscar Executores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Featured Executors */}
                  <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">Executores em Destaque</h2>
                      <Link to="/executors" className="text-white/70 hover:text-white flex items-center gap-2 transition-colors">
                        Ver todos
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredExecutors.map((executor) => (
                        <ExecutorCard key={executor.id} {...executor} />
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

interface ExecutorProps {
  id: string;
  title: string;
  description: string;
  image: string;
  downloadUrl: string;
}

const executors: ExecutorProps[] = [
  {
    id: '1',
    title: 'Swift Executor',
    description: 'Executor rápido e confiável com suporte para a maioria dos scripts Lua.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y29kZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    downloadUrl: 'https://getswift.gg/'
  },
  {
    id: '2',
    title: 'XENO Executor V1.1.75',
    description: 'Executor premium com recursos avançados e injeção de DLL personalizada.',
    image: 'https://i.imgur.com/zxw1m8S.png',
    downloadUrl: 'https://www.xeno.now/download'
  },
  {
    id: '3',
    title: 'Argon',
    description: 'Executor gratuito e leve, perfeito para iniciantes.',
    image: 'https://i.imgur.com/9mzIEFq.png',
    downloadUrl: 'https://getargon.xyz/'
  }
];

function ExecutorCard({ title, description, image, downloadUrl }: ExecutorProps) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors">
      <div className="h-48 relative">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Monitor className="w-4 h-4 text-green-400" />
          <span className="text-white/80 text-sm">PC</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{description}</p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-colors bg-green-600 hover:bg-green-700"
        >
          Download
        </a>
      </div>
    </div>
  );
}

export default App;