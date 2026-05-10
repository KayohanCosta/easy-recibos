import { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'

const inputClass = "w-full px-4 py-3.5 rounded-xl bg-white border-2 border-black text-black font-satoshi text-[15px] font-medium transition-all duration-200 focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_0px_#000000]"
const labelClass = "block mb-2 text-xs font-extrabold tracking-widest uppercase text-black font-cabinet"
const cardClass = "bg-white rounded-2xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_#000000] mb-4"
const rowClass = "flex flex-col md:flex-row gap-4 mb-4"

function Field({ label, children }) {
  return (
    <div className="mb-4 w-full">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  )
}

function Select({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(o => o.value === value) || options[0]

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputClass} flex items-center justify-between cursor-pointer bg-white text-left`}
      >
        <div className="flex items-center gap-3">
          {selectedOption.icon && <Icon icon={selectedOption.icon} className="text-[22px]" />}
          <span className="text-black font-satoshi font-medium">{selectedOption.label}</span>
        </div>
        <Icon icon="mdi:chevron-down" className={`text-xl text-black transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000] overflow-hidden max-h-[300px] overflow-y-auto">
          {options.map(option => (
            <div
              key={option.value}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${value === option.value ? 'bg-[#1a73e8] text-white' : 'hover:bg-gray-100 text-black'}`}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.icon && <Icon icon={option.icon} className="text-[22px]" />}
              <span className="font-satoshi font-medium">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- EMPRESA TAB ----
function EmpresaTab({ company, setCompany }) {
  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCompany(c => ({ ...c, logo: file, logoPreview: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div className={cardClass}>
        <p className={`${labelClass} mb-3`}>Logo da Empresa</p>
        <div className={`border-2 border-dashed border-black rounded-xl p-6 text-center cursor-pointer relative ${company.logoPreview ? 'bg-transparent' : 'bg-gray-100'}`}>
          {company.logoPreview ? (
            <div>
              <img src={company.logoPreview} alt="Logo" className="max-h-20 max-w-[200px] object-contain mx-auto block" />
              <button 
                onClick={() => setCompany(c => ({ ...c, logo: null, logoPreview: null }))}
                className="mt-3 bg-black border-2 border-black text-white cursor-pointer text-xs px-3.5 py-1.5 rounded-lg font-bold shadow-[2px_2px_0px_0px_#ffe17c] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                Remover logo
              </button>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-2">🏢</div>
              <p className="text-black text-sm m-0 font-bold">Clique ou arraste o logo aqui</p>
              <p className="text-gray-600 text-xs mt-1">PNG, JPG, SVG — max 5MB</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleLogo} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        </div>
      </div>

      <div className={cardClass}>
        <Field label="Nome da Empresa *">
          <Input value={company.name} onChange={v => setCompany(c => ({ ...c, name: v }))} placeholder="Empresa LTDA" />
        </Field>
        <div className={rowClass}>
          <Field label="CNPJ">
            <Input value={company.cnpj} onChange={v => setCompany(c => ({ ...c, cnpj: v }))} placeholder="00.000.000/0001-00" />
          </Field>
          <Field label="Telefone">
            <Input value={company.phone} onChange={v => setCompany(c => ({ ...c, phone: v }))} placeholder="(00) 00000-0000" />
          </Field>
        </div>
        <Field label="E-mail">
          <Input value={company.email} onChange={v => setCompany(c => ({ ...c, email: v }))} placeholder="empresa@email.com" type="email" />
        </Field>
        <Field label="Endereço">
          <Input value={company.address} onChange={v => setCompany(c => ({ ...c, address: v }))} placeholder="Rua, número, bairro, cidade — UF" />
        </Field>
      </div>
    </div>
  )
}

// ---- CLIENTE TAB ----
function ClienteTab({ client, setClient }) {
  return (
    <div className={cardClass}>
      <Field label="Nome / Razão Social *">
        <Input value={client.name} onChange={v => setClient(c => ({ ...c, name: v }))} placeholder="João da Silva" />
      </Field>
      <Field label="CPF / CNPJ">
        <Input value={client.cpfCnpj} onChange={v => setClient(c => ({ ...c, cpfCnpj: v }))} placeholder="000.000.000-00" />
      </Field>
      <Field label="E-mail">
        <Input value={client.email} onChange={v => setClient(c => ({ ...c, email: v }))} placeholder="cliente@email.com" type="email" />
      </Field>
      <Field label="Telefone">
        <Input value={client.phone} onChange={v => setClient(c => ({ ...c, phone: v }))} placeholder="(00) 00000-0000" />
      </Field>
      <Field label="Endereço">
        <Input value={client.address} onChange={v => setClient(c => ({ ...c, address: v }))} placeholder="Rua, número, bairro, cidade — UF" />
      </Field>
    </div>
  )
}

// ---- DOCUMENTO TAB ----
function DocumentoTab({ receipt, setReceipt }) {
  let dateLabel = "Data de Emissão"
  let dueDateLabel = "Data de Vencimento"
  let paymentLabel = "Forma de Pagamento"

  if (['proposta', 'orcamento'].includes(receipt.type)) {
    dateLabel = "Data da Proposta"
    dueDateLabel = "Válido até (Opcional)"
    paymentLabel = "Condição de Pagamento"
  } else if (receipt.type === 'contrato') {
    dateLabel = "Data do Contrato"
    dueDateLabel = "Fim da Vigência"
    paymentLabel = "Condição de Pagamento"
  } else if (['recibo', 'nota-servico'].includes(receipt.type)) {
    dueDateLabel = "Data de Vencimento (Opcional)"
  }

  return (
    <div className={cardClass}>
      <div className={rowClass}>
        <Field label="Tipo de Documento">
          <Select
            value={receipt.type}
            onChange={v => setReceipt(r => ({ ...r, type: v }))}
            options={[
              { value: 'recibo', label: 'Recibo', icon: 'fluent-emoji-flat:receipt' },
              { value: 'nota-servico', label: 'Nota de Serviço', icon: 'fluent-emoji-flat:clipboard' },
              { value: 'fatura', label: 'Fatura', icon: 'fluent-emoji-flat:page-facing-up' },
              { value: 'ordem-servico', label: 'Ordem de Serviço', icon: 'fluent-emoji-flat:wrench' },
              { value: 'proposta', label: 'Proposta Comercial', icon: 'fluent-emoji-flat:memo' },
              { value: 'contrato', label: 'Contrato', icon: 'fluent-emoji-flat:scroll' },
              { value: 'orcamento', label: 'Orçamento', icon: 'fluent-emoji-flat:heavy-dollar-sign' },
            ]}
          />
        </Field>
        <Field label="Número">
          <Input value={receipt.number} onChange={v => setReceipt(r => ({ ...r, number: v }))} placeholder="001" />
        </Field>
      </div>
      <div className={rowClass}>
        <Field label={dateLabel}>
          <input
            type="date"
            value={receipt.date}
            onChange={e => setReceipt(r => ({ ...r, date: e.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label={dueDateLabel}>
          <input
            type="date"
            value={receipt.dueDate}
            onChange={e => setReceipt(r => ({ ...r, dueDate: e.target.value }))}
            className={inputClass}
          />
        </Field>
      </div>
      <div className={rowClass}>
        <Field label={paymentLabel}>
          <Select
            value={receipt.paymentMethod}
            onChange={v => setReceipt(r => ({ ...r, paymentMethod: v }))}
            options={[
              { value: 'pix', label: 'PIX', icon: 'fluent-emoji-flat:high-voltage' },
              { value: 'transferencia', label: 'Transferência', icon: 'fluent-emoji-flat:bank' },
              { value: 'boleto', label: 'Boleto', icon: 'fluent-emoji-flat:page-facing-up' },
              { value: 'cartao-credito', label: 'Cartão de Crédito', icon: 'fluent-emoji-flat:credit-card' },
              { value: 'cartao-debito', label: 'Cartão de Débito', icon: 'fluent-emoji-flat:credit-card' },
              { value: 'dinheiro', label: 'Dinheiro', icon: 'fluent-emoji-flat:dollar-banknote' },
              { value: 'cheque', label: 'Cheque', icon: 'fluent-emoji-flat:memo' },
              { value: 'a-prazo', label: 'A prazo', icon: 'fluent-emoji-flat:calendar' },
            ]}
          />
        </Field>
        <Field label="Moeda">
          <Select
            value={receipt.currency}
            onChange={v => setReceipt(r => ({ ...r, currency: v }))}
            options={[
              { value: 'BRL', label: 'BRL — Real', icon: 'fluent-emoji-flat:flag-brazil' },
              { value: 'USD', label: 'USD — Dólar', icon: 'fluent-emoji-flat:flag-united-states' },
              { value: 'EUR', label: 'EUR — Euro', icon: 'fluent-emoji-flat:flag-european-union' },
            ]}
          />
        </Field>
      </div>
      <Field label="Observações / Notas">
        <textarea
          value={receipt.notes}
          onChange={e => setReceipt(r => ({ ...r, notes: e.target.value }))}
          placeholder="Informações adicionais, condições de pagamento, instruções..."
          rows={4}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </Field>
    </div>
  )
}

// ---- ITENS TAB ----
function ItensTab({ items, setItems, subtotal, receipt }) {
  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now(), description: '', quantity: 1, unit: 'un', unitPrice: 0 }])
  }

  const removeItem = (id) => {
    if (items.length === 1) return
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const currencySymbol = receipt?.currency === 'USD' ? '$' : receipt?.currency === 'EUR' ? '€' : 'R$'

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={`${cardClass} relative`}>
          <div className="flex justify-between items-center mb-4">
            <span className="font-cabinet font-extrabold text-[15px] text-black">
              Item #{idx + 1}
            </span>
            {items.length > 1 && (
              <button 
                onClick={() => removeItem(item.id)}
                className="bg-[#ff5f57] border-2 border-black text-white rounded-lg px-3 py-1.5 cursor-pointer text-xs font-bold shadow-[2px_2px_0px_0px_#000000] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              >
                ✕ Remover
              </button>
            )}
          </div>
          <Field label="Descrição">
            <Input
              value={item.description}
              onChange={v => updateItem(item.id, 'description', v)}
              placeholder="Descrição do serviço ou produto"
            />
          </Field>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Field label="Qtd.">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Unidade">
                <Select
                  value={item.unit}
                  onChange={v => updateItem(item.id, 'unit', v)}
                  options={[
                    { value: 'un', label: 'un' },
                    { value: 'hr', label: 'hr' },
                    { value: 'dia', label: 'dia' },
                    { value: 'mês', label: 'mês' },
                    { value: 'kg', label: 'kg' },
                    { value: 'm²', label: 'm²' },
                    { value: 'km', label: 'km' },
                    { value: 'proj', label: 'proj' },
                  ]}
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label={`Valor (${currencySymbol})`}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
          <div className="text-right text-[15px] font-extrabold font-cabinet text-black pt-2">
            Subtotal: {currencySymbol} {(item.quantity * item.unitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      ))}

      <button 
        onClick={addItem}
        className="w-full p-4 rounded-2xl cursor-pointer bg-white border-2 border-dashed border-black text-black font-cabinet font-extrabold text-[15px] mb-4 transition-all duration-200 hover:bg-gray-50"
      >
        + Adicionar Item
      </button>

      {/* Total summary */}
      <div className="bg-primary rounded-2xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex justify-between items-center">
          <span className="font-cabinet font-extrabold text-xl text-black">
            Total
          </span>
          <span className="font-cabinet font-black text-3xl text-black">
            {currencySymbol} {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function FormSection({ activeTab, company, setCompany, client, setClient, receipt, setReceipt, items, setItems, subtotal }) {
  return (
    <div className="w-full">
      {activeTab === 'empresa' && <EmpresaTab company={company} setCompany={setCompany} />}
      {activeTab === 'cliente' && <ClienteTab client={client} setClient={setClient} />}
      {activeTab === 'documento' && <DocumentoTab receipt={receipt} setReceipt={setReceipt} />}
      {activeTab === 'itens' && <ItensTab items={items} setItems={setItems} subtotal={subtotal} receipt={receipt} />}
    </div>
  )
}
