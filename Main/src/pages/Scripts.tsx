import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Copy, Download } from 'lucide-react';

interface ScriptBloxResponse {
  result: {
    scripts: Script[];
    totalPages: number;
    nextPage: number;
  };
}

interface Script {
  _id: string;
  title: string;
  description: string;
  image: string;
  downloadUrl: string;
  game: {
    name: string;
  };
  verified: boolean;
  views: number;
  script: string;
}

interface ScriptCardProps {
  title: string;
  description: React.ReactNode;
  image: string;
  downloadUrl: string;
  game: {
    name: string;
  };
  script: string;
  onDownloadClick: (script: string) => void;
}

function ScriptCard({ title, description, image, downloadUrl, game, script, onDownloadClick }: ScriptCardProps) {
  const imageUrl = image.startsWith('/images/script/') 
    ? `https://scriptblox.com${image}`
    : image;

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors">
      <div className="h-48 relative">
        <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white/80 text-sm font-medium bg-white/5 px-3 py-1 rounded-full">{game.name}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 hover:text-green-400 transition-colors line-clamp-1">{title}</h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2 font-medium">{description}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onDownloadClick(script)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-colors bg-green-600 hover:bg-green-700 font-semibold"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

function ScriptModal({ script, onClose }: { script: string, onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const rawUrl = script.match(/game:HttpGet\("([^"]+)"/)?.[1] || '#';
  const downloadUrl = rawUrl.replace('raw.githubusercontent.com', 'raw.githubusercontent.com/raw');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Criar um blob com o conteúdo do script
    const blob = new Blob([script], { type: 'text/plain' });
    
    // Criar um link temporário para download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Extrair o nome do script da URL
    const scriptName = rawUrl.split('/').pop()?.split('.')[0] || 'script';
    const fileName = `${scriptName}.lua`;
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Limpar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] ring ring-white/10 divide-y divide-white/10 rounded-xl shadow-sm w-full max-w-2xl overflow-hidden">
        <div className="p-4 sm:px-6 flex justify-between items-center">
          <a 
            href={rawUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-lg text-white hover:underline"
          >
            Ver Raw
          </a>
          <div className="flex items-center space-x-4">
            <button
              onClick={copyToClipboard}
              className="rounded-lg font-medium inline-flex items-center px-2.5 py-1.5 text-sm gap-1.5 text-white hover:bg-white/10 transition-colors"
            >
              <Copy className="w-5 h-5" />
              {copied ? 'Copiado!' : 'Copiar Script'}
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg font-medium inline-flex items-center px-2.5 py-1.5 text-sm gap-1.5 text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <pre className="w-full bg-[#0a0a0a] rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-white/80 font-mono">
              <span className="text-emerald-400">loadstring</span>
              <span className="text-white">(</span>
              <span className="text-green-400">game</span>
              <span className="text-white">:HttpGet(</span>
              <span className="text-emerald-500">"{rawUrl}"</span>
              <span className="text-white">))()</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function Scripts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const onDownloadClick = (script: string) => {
    setSelectedScript(script);
  };

  // Função unificada para buscar scripts
  const fetchScripts = async (search: string = '', page: number = 1, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = search.trim() 
        ? `/api/api/script/search?q=${encodeURIComponent(search)}&page=${page}`
        : `/api/api/script/fetch?page=${page}`;

      console.log('Buscando scripts em:', endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar scripts');
      }

      const data: ScriptBloxResponse = await response.json();
      console.log('Scripts carregados:', data.result.scripts.length);
      
      // Atualizar informações de paginação
      setTotalPages(data.result.totalPages);
      setHasMore(page < data.result.totalPages);
      
      // Adicionar scripts à lista existente ou substituir
      if (append) {
        setScripts(prevScripts => [...prevScripts, ...data.result.scripts]);
      } else {
        setScripts(data.result.scripts);
      }
    } catch (err) {
      setError('Erro ao carregar scripts. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar scripts iniciais
  useEffect(() => {
    fetchScripts('', 1);
  }, []);

  // Buscar scripts quando o termo de busca mudar
  useEffect(() => {
    // Resetar para a primeira página quando mudar a busca
    setCurrentPage(1);
    
    const debounceTimer = setTimeout(() => {
      // Se o campo de busca estiver vazio, voltar para a API de fetch padrão
      // Caso contrário, usar a API de busca
      fetchScripts(searchTerm, 1);
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);
  
  // Função para carregar mais scripts
  const loadMoreScripts = () => {
    if (loading || !hasMore) {
      console.log('Não carregando mais scripts:', { loading, hasMore });
      return;
    }
    
    console.log('Carregando mais scripts, página:', currentPage + 1);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchScripts(searchTerm, nextPage, true);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {selectedScript && (
        <ScriptModal
          script={selectedScript}
          onClose={() => setSelectedScript(null)}
        />
      )}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Scripts</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <form className="flex-1" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="search"
                  className="flex h-10 rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-white/5 border-white/10 text-white w-full"
                  placeholder="Buscar scripts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-white border-white/20">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-white/70">
            Carregando scripts...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && scripts.length === 0 && searchTerm && (
          <div className="text-center text-white/70">
            Nenhum script encontrado para "{searchTerm}"
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <ScriptCard
              key={script._id}
              title={script.title}
              description={
                <span>
                  <span className="text-green-400">{script.game.name}</span>
                  <span className="mx-2">•</span>
                  <span className="text-white/60">{script.views.toLocaleString()} visualizações</span>
                </span>
              }
              image={script.image}
              downloadUrl={script.downloadUrl}
              game={script.game}
              script={script.script}
              onDownloadClick={onDownloadClick}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          {hasMore && (
            <button 
              onClick={loadMoreScripts}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 border h-10 px-6 py-2 text-white border-green-500 bg-green-600 hover:bg-green-700 cursor-pointer z-10 relative"
            >
              {loading ? 'Carregando...' : 'Carregar mais'}
            </button>
          )}
          {!hasMore && scripts.length > 0 && (
            <p className="text-white/50 text-sm">Não há mais scripts para carregar</p>
          )}
        </div>
      </div>
    </div>
  );
}