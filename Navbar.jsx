import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function Navbar({ currentPage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNav = (target) => {
    onNavigate(target)
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 h-20 bg-primary border-b-2 border-black px-4 md:px-8 flex items-center justify-between">
      <div 
        className="flex items-center gap-3 cursor-pointer relative z-50"
        onClick={() => handleNav('landing')}
      >
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-2xl text-white brutal-border shadow-[2px_2px_0px_0px_#ffffff]">
          <Icon icon="ph:receipt-bold" />
        </div>
        <span className="font-cabinet font-extrabold text-2xl tracking-tighter text-black">
          Easy Recibos
        </span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 items-center">
        {currentPage === 'landing' && ['Recursos', 'Como Funciona', 'Depoimentos'].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="font-satoshi font-bold text-sm text-black no-underline hover:underline">
            {item}
          </a>
        ))}
        {currentPage === 'landing' ? (
          <button 
            onClick={() => handleNav('gerador')}
            className="bg-black text-white brutal-border shadow-[4px_4px_0px_0px_#000000] px-6 py-3 rounded-xl font-cabinet font-bold text-sm transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Crie já
          </button>
        ) : (
          <button 
            onClick={() => handleNav('landing')}
            className="bg-white text-black brutal-border shadow-[4px_4px_0px_0px_#000000] px-6 py-3 rounded-xl font-cabinet font-bold text-sm transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Voltar ao Início
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden relative z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="w-10 h-10 bg-white brutal-border shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center text-2xl text-black transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <Icon icon={isOpen ? "mdi:close" : "mdi:menu"} />
        </button>
      </div>

      {/* Mobile Creative Dropdown */}
      <div 
        className={`absolute top-24 left-4 right-4 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-2xl p-6 flex flex-col gap-6 md:hidden transition-all duration-300 origin-top z-40 ${isOpen ? 'scale-y-100 opacity-100 pointer-events-auto' : 'scale-y-0 opacity-0 pointer-events-none'}`}
      >
        {currentPage === 'landing' && ['Recursos', 'Como Funciona', 'Depoimentos'].map(item => (
          <a 
            key={item} 
            href={`#${item.toLowerCase().replace(' ', '-')}`} 
            onClick={() => setIsOpen(false)}
            className="font-cabinet font-black text-2xl text-black no-underline hover:text-gray-600 transition-colors border-b-2 border-gray-100 pb-2 flex justify-between items-center"
          >
            {item}
            <Icon icon="mdi:arrow-right" className="text-xl opacity-50" />
          </a>
        ))}
        {currentPage === 'landing' ? (
          <button 
            onClick={() => handleNav('gerador')}
            className="w-full bg-[#ff5f57] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] px-6 py-4 rounded-xl font-cabinet font-black text-xl transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none mt-2 flex justify-center items-center gap-2"
          >
            Começar a criar
            <Icon icon="mdi:lightning-bolt" />
          </button>
        ) : (
          <button 
            onClick={() => handleNav('landing')}
            className="w-full bg-[#ffe17c] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] px-6 py-4 rounded-xl font-cabinet font-black text-xl transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none mt-2 flex justify-center items-center gap-2"
          >
            Voltar ao Início
            <Icon icon="mdi:home" />
          </button>
        )}
      </div>
    </nav>
  )
}
