import { Icon } from '@iconify/react'

export default function Navbar({ currentPage, onNavigate }) {
  return (
    <nav className="sticky top-0 z-50 h-20 bg-primary border-b-2 border-black px-4 md:px-8 flex items-center justify-between">
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => onNavigate('landing')}
      >
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-2xl text-white brutal-border shadow-[2px_2px_0px_0px_#ffffff]">
          <Icon icon="ph:receipt-bold" />
        </div>
        <span className="font-cabinet font-extrabold text-2xl tracking-tighter text-black">
          Easy Recibos
        </span>
      </div>
      <div className="hidden md:flex gap-8 items-center">
        {currentPage === 'landing' && ['Recursos', 'Como Funciona', 'Depoimentos'].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="font-satoshi font-bold text-sm text-black no-underline hover:underline">
            {item}
          </a>
        ))}
        {currentPage === 'landing' ? (
          <button 
            onClick={() => onNavigate('gerador')}
            className="bg-black text-white brutal-border shadow-[4px_4px_0px_0px_#000000] px-6 py-3 rounded-xl font-cabinet font-bold text-sm transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Crie já
          </button>
        ) : (
          <button 
            onClick={() => onNavigate('landing')}
            className="bg-white text-black brutal-border shadow-[4px_4px_0px_0px_#000000] px-6 py-3 rounded-xl font-cabinet font-bold text-sm transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Voltar ao Início
          </button>
        )}
      </div>
    </nav>
  )
}
