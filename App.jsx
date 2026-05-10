import { useState, useRef, useEffect } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Icon } from '@iconify/react'
import FormSection from './FormSection.jsx'
import ReceiptPreview from './ReceiptPreview.jsx'
import Navbar from './Navbar.jsx'

const defaultCompany = {
  name: '',
  cnpj: '',
  address: '',
  phone: '',
  email: '',
  logo: null,
  logoPreview: null,
}

const defaultClient = {
  name: '',
  cpfCnpj: '',
  address: '',
  phone: '',
  email: '',
}

const defaultReceipt = {
  number: `REC-${Date.now().toString().slice(-6)}`,
  type: 'recibo',
  date: new Date().toISOString().split('T')[0],
  dueDate: '',
  paymentMethod: 'pix',
  notes: '',
  currency: 'BRL',
}

const defaultItems = [
  { id: 1, description: '', quantity: 1, unit: 'un', unitPrice: 0 }
]

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [activeTab, setActiveTab] = useState('empresa')
  const [company, setCompany] = useState(defaultCompany)
  const [client, setClient] = useState(defaultClient)
  const [receipt, setReceipt] = useState(defaultReceipt)
  const [items, setItems] = useState(defaultItems)
  const [isGenerating, setIsGenerating] = useState(false)
  const previewRef = useRef(null)
  const containerRef = useRef(null)
  const [previewScale, setPreviewScale] = useState(1)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setPreviewScale(entry.contentRect.width / 794)
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [currentPage])

  const tabs = [
    { id: 'empresa', label: 'Empresa' },
    { id: 'cliente', label: 'Cliente' },
    { id: 'documento', label: 'Documento' },
    { id: 'itens', label: 'Itens' },
  ]

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    await new Promise(r => setTimeout(r, 200))
    try {
      const element = previewRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight = (canvas.height * pageWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
      heightLeft -= pageHeight
      // Add a 1mm tolerance to prevent an extra blank page for tiny pixel overflows
      while (heightLeft > 1) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
        heightLeft -= pageHeight
      }
      pdf.save(`${receipt.type}-${receipt.number}.pdf`)
    } catch (err) {
      console.error(err)
    }
    setIsGenerating(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Hidden receipt for PDF */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        <ReceiptPreview
          ref={previewRef}
          company={company}
          client={client}
          receipt={receipt}
          items={items}
          subtotal={subtotal}
        />
      </div>

      {currentPage === 'landing' ? (
        <>
          <div className="bg-dots border-b-2 border-black w-full min-h-[85vh] flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-between px-4 lg:px-24 py-16 md:py-24 gap-12 lg:gap-16 overflow-hidden text-center lg:text-left">
            
            {/* Arte do Recibo no Topo (Mobile) / Lado Direito (Desktop) */}
            <div className="flex relative items-center justify-center w-full max-w-[280px] md:max-w-[400px] lg:max-w-[500px] mb-8 lg:mb-0 mt-4 md:mt-0">
              <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] bg-black rounded-[2rem] transform rotate-[10deg] translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4"></div>
              <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] bg-white border-[3px] md:border-4 border-black rounded-[2rem] transform -rotate-[4deg] transition-transform duration-700 hover:rotate-0 flex items-center justify-center">
                <div className="w-full h-full rounded-[1.7rem] opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
              </div>
              <img src="/logo.svg" alt="Recibo Criativo" className="relative z-10 w-[280px] md:w-[380px] lg:w-[450px] animate-float" style={{ filter: 'drop-shadow(8px 8px 0px rgba(0,0,0,0.2))' }} />
            </div>

            {/* Texto Embaixo (Mobile) / Lado Esquerdo (Desktop) */}
            <div className="flex flex-col items-center lg:items-start max-w-3xl lg:max-w-xl relative z-10">
              <h1 className="font-cabinet font-black text-6xl md:text-8xl text-black leading-tight mb-6">
                Recibos & <br className="hidden lg:block"/>
                <span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>Documentos</span>
              </h1>
              <p className="font-satoshi font-medium text-lg md:text-xl text-black/80 max-w-2xl lg:max-w-lg mb-10 mx-auto lg:mx-0">
                Crie documentos profissionais em segundos. Download gratuito em PDF pronto para enviar ao seu cliente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                <button
                  onClick={() => setCurrentPage('gerador')}
                  className="brutal-btn bg-black text-white px-10 py-4 rounded-xl font-cabinet font-bold text-xl brutal-shadow-lg mx-auto lg:mx-0"
                >
                  Começar a criar
                </button>
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className="max-w-[1280px] mx-auto p-4 md:p-8 w-full">
          <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
            {/* Left: Form */}
            <div className="w-full lg:w-[45%] flex flex-col gap-6">
              {/* Tabs */}
              <div className="flex gap-2 p-2 rounded-2xl bg-white brutal-border brutal-shadow">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-2 rounded-xl text-sm font-extrabold font-cabinet transition-all duration-200 cursor-pointer border-2 ${
                      activeTab === tab.id 
                        ? 'bg-black text-white border-black' 
                        : 'bg-transparent text-black border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <FormSection
                activeTab={activeTab}
                company={company}
                setCompany={setCompany}
                client={client}
                setClient={setClient}
                receipt={receipt}
                setReceipt={setReceipt}
                items={items}
                setItems={setItems}
                subtotal={subtotal}
              />

              {/* Buttons */}
              <div className="flex gap-3 mt-2 w-full">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  className={`flex-1 py-4 rounded-xl font-black text-lg font-cabinet brutal-border brutal-shadow-lg transition-all duration-200 ${
                    isGenerating ? 'bg-primary/70 cursor-not-allowed translate-x-1 translate-y-1 shadow-none' : 'bg-primary cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                  }`}
                >
                  {isGenerating ? '⏳ Gerando PDF...' : '⬇ Baixar PDF'}
                </button>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="w-full lg:w-[55%] lg:sticky lg:top-28">
              <div className="rounded-2xl overflow-hidden brutal-border bg-white brutal-shadow-lg">
                {/* Browser Mockup Header */}
                <div className="px-5 py-3 flex items-center justify-between border-b-2 border-black bg-black">
                  <span className="text-sm font-extrabold font-cabinet text-white">
                    📄 Preview
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border-2 border-black" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e] border-2 border-black" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840] border-2 border-black" />
                  </div>
                </div>
                
                <div ref={containerRef} className="w-full relative overflow-hidden bg-charcoal aspect-[794/1123]">
                  <div style={{ width: '794px', height: '1123px', transformOrigin: 'top left', transform: `scale(${previewScale})` }}>
                    <ReceiptPreviewDisplay
                      company={company}
                      client={client}
                      receipt={receipt}
                      items={items}
                      subtotal={subtotal}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'landing' && (
        <>
          <section id="recursos" style={{ padding: '6rem 1rem', background: '#111111', color: '#ffffff', borderTop: '3px solid #111111' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Syne, sans-serif', fontWeight: 900, textAlign: 'center', marginBottom: '3rem', color: '#FDE047' }}>Recursos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Velocidade', desc: 'Gere documentos profissionais em segundos.', icon: 'ph:lightning-duotone' },
              { title: 'Personalização', desc: 'Adicione logo e cores da sua empresa.', icon: 'ph:palette-duotone' },
              { title: 'Pronto para PDF', desc: 'Exporte para PDF otimizado instantaneamente.', icon: 'ph:file-pdf-duotone' }
            ].map(r => (
               <div key={r.title} style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '3px solid #FDE047', boxShadow: '6px 6px 0px #FDE047', color: '#111111' }}>
                 <div style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#111111' }}>
                   <Icon icon={r.icon} />
                 </div>
                 <h3 style={{ fontSize: '1.5rem', fontFamily: 'Syne, sans-serif', fontWeight: 800, marginBottom: '0.5rem' }}>{r.title}</h3>
                 <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>{r.desc}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-24 px-4 bg-charcoal text-white border-t-2 border-black">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-cabinet font-black mb-16 text-primary">Como Funciona</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {[
              { step: '1', title: 'Conecte', desc: 'Preencha seus dados em poucos minutos.', color: 'border-sage' },
              { step: '2', title: 'Visualize', desc: 'Veja o preview do documento em tempo real.', color: 'border-primary' },
              { step: '3', title: 'Escalone', desc: 'Gere seu PDF e envie para o cliente.', color: 'border-white' }
            ].map((s, i) => (
              <div key={s.step} className="flex-1 min-w-[250px] relative">
                {i < 2 && <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-[#272727] -z-10" />}
                <div className={`w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 border-4 ${s.color} shadow-[4px_4px_0px_0px_#000000]`}>
                  {s.step}
                </div>
                <h3 className="text-2xl font-cabinet font-extrabold mb-2">{s.title}</h3>
                <p className="font-satoshi font-medium text-gray-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="py-24 px-4 bg-sage text-black border-t-2 border-black">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-cabinet font-black text-center mb-16">O Que Dizem Nossos Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { text: '"Transformou completamente nossa operação. Aumentamos nossas receitas em 300%!"', author: 'João Martinez', role: 'CEO, TechStart' },
               { text: '"Incrível! A automação funcionou perfeitamente. Nossa equipe agora foca em tarefas estratégicas."', author: 'Sarah Chen', role: 'COO, Inovadora' },
               { text: '"O melhor investimento que fizemos. ROI positivo em menos de 30 dias. Recomendado!"', author: 'Marcos Rodrigues', role: 'Fundador, SME Labs' }
             ].map(d => (
               <div key={d.author} className="bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_#000000]" style={{ borderRadius: '24px 2px 24px 2px' }}>
                 <div className="text-[#ffbc2e] text-2xl mb-4 tracking-widest">★★★★★</div>
                 <p className="font-satoshi font-bold text-lg mb-6 leading-relaxed">"{d.text}"</p>
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary rounded-full border-2 border-black flex items-center justify-center font-black text-xl">
                     {d.author.split(' ').map(n=>n[0]).join('')}
                   </div>
                   <div>
                     <div className="font-extrabold font-cabinet">{d.author}</div>
                     <div className="text-sm text-gray-600 font-satoshi">{d.role}</div>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-charcoal text-white py-16 px-4 flex flex-col items-center justify-center border-t-2 border-black text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-xl text-white border-2 border-white">
            <Icon icon="ph:receipt-bold" />
          </div>
          <span className="font-cabinet font-extrabold text-xl">Easy Recibos</span>
        </div>
        <p className="font-satoshi font-medium text-gray-400 text-sm mb-12">© 2026 Easy Recibos. Todos os direitos reservados.</p>
        
        <div className="flex flex-col items-center gap-4 pt-8 border-t border-gray-800 w-full max-w-[300px]">
          <div className="font-cabinet font-bold text-gray-300">Desenvolvido por KayohanCostaDev!</div>
          <div className="flex gap-6 mt-2">
            <a href="https://linkedin.com/in/kayohancostadev" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Icon icon="mdi:linkedin" width="28" height="28" />
            </a>
            <a href="https://github.com/KayohanCosta" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Icon icon="mdi:github" width="28" height="28" />
            </a>
            <a href="https://wa.me/5585998213158" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#25D366] transition-colors">
              <Icon icon="mdi:whatsapp" width="28" height="28" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Inline display-only version (not used for PDF)
function ReceiptPreviewDisplay(props) {
  return <ReceiptPreview {...props} />
}
