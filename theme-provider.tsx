"use client"

import React, { useState, useCallback } from "react"
import { Paintbrush, Search, User, ShoppingCart, MapPin, Phone, Clock, Shield, HelpCircle, Truck, Star, ChevronRight, Check, Mail, Instagram, Facebook, MessageCircle, Heart, Share2, Copy, Loader2, Eye, Sparkles, Zap, Bell, Download, ArrowRight, ExternalLink, RefreshCw, Minus, Plus, Trash2, Home, Headphones, Accessibility, Package } from "lucide-react"

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
  category: string
  ref?: string
}

interface CartItem extends Product {
  qty: number
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: 1, name: "Tinta Acrílica Fosca", price: 259.9, imageUrl: "https://images.tcdn.com.br/img/img_prod/650361/tinta_acrilica_fosco_completo_coral_branco_18l_4025_1_20200422151912.jpg", category: "Tintas", ref: "Branco neve 18L" },
  { id: 2, name: "Tinta PU Automotiva Preto 3,6L", price: 189.9, imageUrl: "https://tse4.mm.bing.net/th/id/OIP.4zWZc9f3nS2uR6pTj6m0UQHaHa", category: "Tintas" },
  { id: 3, name: "Primer PU Cinza 3,6L", price: 149.9, imageUrl: "https://tse3.mm.bing.net/th/id/OIP.qO6MysNn7M8jYzY2wqKz6QHaHa", category: "Tintas" },
  { id: 4, name: "Verniz PU Auto Luks + Catalisador", price: 129.9, imageUrl: "https://cdn.awsli.com.br/2500x2500/1869/1869036/produto/153855114/3ca522bacc.jpg", category: "Vernizes" },
  { id: 5, name: "Verniz Alto Brilho 2K 900ml", price: 59.9, imageUrl: "https://tse3.mm.bing.net/th/id/OIP.S1A3E0wPj6q4K2fW7ZP3yAHaHa", category: "Vernizes" },
  { id: 6, name: "Thinner 900ml Anjo", price: 19.9, imageUrl: "https://cdn.awsli.com.br/600x700/1347/1347540/produto/53873337/thinner-900ml-anjo.jpg", category: "Thinner" },
  { id: 7, name: "Thinner Automotivo 5L", price: 79.9, imageUrl: "https://tse4.mm.bing.net/th/id/OIP.t7f9S7YoY4-lqYh6xK-EdAHaHa", category: "Thinner" },
  { id: 8, name: "Esmalte Sintético Branco 3,6L", price: 89.9, imageUrl: "https://m.media-amazon.com/images/I/5156f0sCGDL._AC_SX679_.jpg", category: "Esmaltes" },
  { id: 9, name: "Esmalte Sintético Preto 900ml", price: 39.9, imageUrl: "https://tse3.mm.bing.net/th/id/OIP.wLkWg5p0FZsPZt8cQh4M6QHaHa", category: "Esmaltes" },
  { id: 10, name: "Rolo de Lã 15cm", price: 19.9, imageUrl: "https://images.tcdn.com.br/img/img_prod/650361/rolo_de_la_para_pintura_atlas_15cm_4025_1_20200422151912.jpg", category: "Acessórios", ref: "Ref. 137/23" },
  { id: 11, name: "Fita Crepe Automotiva 3M", price: 14.9, imageUrl: "https://tse2.mm.bing.net/th/id/OIP.h9V1oQeQ5KXx8kJvU9oTzwHaHa", category: "Acessórios" },
  { id: 12, name: "Pistola de Pintura HVLP Pro-530", price: 249.9, imageUrl: "https://casadosoldador.com.br/files/products_images/18952/pistola-de-pintura-hvlp-pro-530-bico-13-600ml-pdr-casa-do-soldador-01.jpg", category: "Ferramentas" },
]

const CATEGORIES = ["Todos", "Tintas", "Vernizes", "Thinner", "Esmaltes", "Acessórios", "Ferramentas"]

const REVIEWS = [
  { initials: "MF", name: "Marcos F.", bg: "bg-primary", tc: "text-white", text: "Excelentes materiais, ótimo atendimento e preços muito competitivos. Recomendo muito!", date: "há 2 dias" },
  { initials: "RS", name: "Rafael S.", bg: "bg-accent", tc: "text-primary", text: "Muito bem atendido, preços muito bons. Fui comprar tinta para o carro e saí com tudo que precisava.", date: "há 5 dias" },
  { initials: "CL", name: "Carla L.", bg: "bg-emerald-600", tc: "text-white", text: "Ótima loja! Equipe muito prestativa e o estoque é completo. Voltarei sempre.", date: "há 1 semana" },
]

// ─── TOAST NOTIFICATION ──────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }: { message: string; type: "success" | "info" | "error"; onClose: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === "success" ? "bg-emerald-600" : type === "error" ? "bg-red-600" : "bg-primary"

  return (
    <div className={`fixed top-20 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-xl z-[300] flex items-center gap-2 animate-slide-in`}>
      {type === "success" && <Check size={18} />}
      {type === "info" && <Bell size={18} />}
      {type === "error" && <Trash2 size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

// ─── SILVER BUTTON ───────────────────────────────────────────────────────────

interface SilverButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "solid" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
  className?: string
}

const SilverButton = ({
  children,
  onClick,
  variant = "solid",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  className = "",
}: SilverButtonProps) => {
  const [ripple, setRipple] = useState(false)

  const handleClick = () => {
    if (disabled || loading) return
    setRipple(true)
    setTimeout(() => setRipple(false), 300)
    onClick?.()
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  }

  const variantClasses = {
    solid: "bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 text-primary border border-slate-300 hover:from-slate-300 hover:via-slate-200 hover:to-slate-300 shadow-lg hover:shadow-xl",
    outline: "bg-transparent text-slate-400 border-2 border-slate-400 hover:bg-slate-400/10 hover:text-slate-300",
    ghost: "bg-transparent text-slate-400 border-none hover:bg-slate-400/10",
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}
        ${ripple ? "animate-ripple" : ""}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </button>
  )
}

// ─── PRIMARY BUTTON ──────────────────────────────────────────────────────────

const PrimaryButton = ({
  children,
  onClick,
  size = "md",
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  className = "",
}: Omit<SilverButtonProps, "variant">) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2
        bg-primary text-white border-none hover:bg-blue-800 shadow-lg hover:shadow-xl
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </button>
  )
}

// ─── SMALL HELPERS ───────────────────────────────────────────────────────────

const fmt = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`

const StarRow = ({ size = 13 }: { size?: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size} className="fill-accent text-accent" />
    ))}
  </div>
)

// ─── HEADER ──────────────────────────────────────────────────────────────────

const Header = ({
  page,
  setPage,
  cartCount,
  onCartOpen,
}: {
  page: string
  setPage: (p: string) => void
  cartCount: number
  onCartOpen: () => void
}) => {
  const openWhatsApp = () => {
    window.open("https://wa.me/5519999999999?text=Olá! Gostaria de mais informações sobre tintas.", "_blank")
  }

  return (
    <header className="bg-primary text-white px-4 py-3 sticky top-0 z-50 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="cursor-pointer" onClick={() => setPage("home")}>
          <div className="text-xl font-bold italic tracking-wide text-silver">Silver</div>
          <div className="text-[9px] text-white/50 tracking-normal not-italic">Tintas</div>
        </div>
        <div className="flex gap-3.5 items-center">
          <Search size={18} className="text-silver cursor-pointer hover:text-accent transition-colors" />
          <User size={18} className="text-silver cursor-pointer hover:text-accent transition-colors" />
          <div className="relative cursor-pointer" onClick={onCartOpen}>
            <ShoppingCart size={18} className="text-silver hover:text-accent transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide border-t border-white/15 pt-2">
        <button
          onClick={() => setPage("home")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex-shrink-0 ${
            page === "home"
              ? "bg-gradient-to-r from-slate-300 to-slate-400 text-primary shadow-md"
              : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
        >
          <Home size={14} />
          Início
        </button>

        <button
          onClick={() => setPage("produtos")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex-shrink-0 ${
            page === "produtos"
              ? "bg-gradient-to-r from-slate-300 to-slate-400 text-primary shadow-md"
              : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
        >
          <Package size={14} />
          Produtos
        </button>

        <button
          onClick={openWhatsApp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex-shrink-0 bg-emerald-500 text-white hover:bg-emerald-600 shadow-md"
        >
          <MessageCircle size={14} />
          WhatsApp
        </button>

        <button
          onClick={() => window.open("tel:+551932874747")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex-shrink-0 bg-white/10 text-white/80 hover:bg-white/20"
        >
          <Headphones size={14} />
          Suporte
        </button>

        <button
          onClick={() => alert("Modo de acessibilidade ativado! Recursos: Alto contraste, Leitura de tela, Navegação por teclado.")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex-shrink-0 bg-blue-600 text-white hover:bg-blue-700 shadow-md"
        >
          <Accessibility size={14} />
          PCD
        </button>
      </div>

      {/* Categories */}
      <nav className="flex gap-0 border-t border-white/15 pt-2 mt-1">
        {["Tintas", "Acessórios", "Preparação", "Ofertas", "Marcas"].map((n) => (
          <span
            key={n}
            onClick={() => setPage("produtos")}
            className="text-[11px] text-white/75 pr-3.5 cursor-pointer whitespace-nowrap hover:text-accent transition-colors"
          >
            {n}
          </span>
        ))}
      </nav>
    </header>
  )
}

// ─── STEPS BAR ───────────────────────────────────────────────────────────────

const Steps = ({ current }: { current: number }) => {
  const labels = ["Carrinho", "Identificação e Pagamento", "Confirmação"]
  return (
    <div className="flex items-center justify-center py-3.5 px-4 bg-white border-b border-gray-200">
      {labels.map((label, i) => {
        const num = i + 1
        const active = num === current
        const done = num < current
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  active || done ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {done ? <Check size={14} /> : num}
              </div>
              <div className="text-[10px] text-gray-600 text-center max-w-[70px]">{label}</div>
            </div>
            {i < labels.length - 1 && (
              <div className={`w-12 h-0.5 mx-0.5 mb-4 transition-all ${done ? "bg-primary" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="bg-primary text-white py-5 px-4">
    <div className="text-2xl font-bold italic mb-0.5 text-silver">Silver</div>
    <div className="text-[10px] text-white/40 mb-4">Qualidade que você confia · Campinas, SP</div>
    <div className="grid grid-cols-3 gap-2 mb-4">
      {[
        { title: "Institucional", links: ["Sobre nós", "Loja física", "Contato"] },
        { title: "Produtos", links: ["Tintas", "Vernizes", "Ferramentas"] },
        { title: "Atendimento", links: ["Central de ajuda", "Trocas", "Entregas"] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="text-[10px] font-bold text-white/90 mb-1.5 uppercase tracking-wide">{col.title}</h4>
          {col.links.map((l) => (
            <a key={l} className="block text-[10px] text-white/45 mb-0.5 cursor-pointer hover:text-accent transition-colors">
              {l}
            </a>
          ))}
        </div>
      ))}
    </div>
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent/30 transition-colors cursor-pointer">
        <MessageCircle size={16} className="text-white" />
      </div>
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent/30 transition-colors cursor-pointer">
        <Instagram size={16} className="text-white" />
      </div>
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent/30 transition-colors cursor-pointer">
        <Facebook size={16} className="text-white" />
      </div>
    </div>
    <div className="border-t border-white/10 mt-3 pt-2.5 text-[9px] text-white/30">
      © 2026 Silver Tintas · Av. Arymana, 299B · Campinas – SP · (19) 3266-0789
    </div>
  </footer>
)

// ─── HOME PAGE ───────────────────────────────────────────────────────────────

const HomePage = ({ 
  setPage, 
  onAddToCart, 
  favorites, 
  onToggleFavorite 
}: { 
  setPage: (p: string) => void
  onAddToCart: (p: Product) => void
  favorites: number[]
  onToggleFavorite: (id: number) => void
}) => {
  const [selCat, setSelCat] = useState("Todos")
  const [loading, setLoading] = useState<string | null>(null)

  // Filter products by selected category
  const filteredProducts = selCat === "Todos" 
    ? PRODUCTS 
    : PRODUCTS.filter((p) => p.category === selCat)

  const handleViewProducts = () => {
    setLoading("produtos")
    setTimeout(() => {
      setLoading(null)
      setPage("produtos")
    }, 500)
  }

  return (
    <div>
      {/* HERO */}
      <div className="bg-gradient-to-br from-primary via-primary to-blue-900 text-white px-4 py-7 pb-6">
        <div className="text-[10px] tracking-[2px] text-white/50 uppercase mb-2 flex items-center gap-2">
          <Sparkles size={12} className="text-accent" />
          Campinas, SP · Desde 1995
        </div>
        <h1 className="text-2xl font-bold leading-tight mb-2.5">
          Tudo para sua <span className="text-accent">pintura perfeita</span>
        </h1>
        <p className="text-[13px] text-white/70 leading-relaxed mb-4 max-w-[280px]">
          Tintas, vernizes, esmaltes, ferramentas e muito mais. Entrega no mesmo dia em Campinas.
        </p>
        <div className="flex gap-2 flex-wrap">
          <SilverButton
            onClick={handleViewProducts}
            loading={loading === "produtos"}
            icon={<Eye size={16} />}
            iconRight={<ArrowRight size={14} />}
          >
            Ver produtos
          </SilverButton>
          <SilverButton
            onClick={() => setPage("cor")}
            variant="outline"
            icon={<Paintbrush size={16} />}
          >
            Buscar cor
          </SilverButton>
        </div>
        <div className="bg-accent/15 border border-accent/40 rounded-lg px-3.5 py-2.5 mt-4 inline-flex items-center gap-2">
          <Star size={16} className="fill-accent text-accent" />
          <div className="text-[11px] text-white/80">
            <strong className="text-accent text-[13px] block">4,7 no Google</strong>
            4.719 avaliações verificadas
          </div>
        </div>
      </div>

      {/* PROMO */}
      <div className="bg-accent px-4 py-3.5 flex items-center gap-3">
        <Truck size={22} className="text-primary" />
        <div className="text-xs text-primary leading-snug">
          <strong className="text-[13px] block">Entrega no mesmo dia em Campinas</strong>
          Peça até as 14h e receba ainda hoje
        </div>
      </div>

      {/* INFO */}
      <div className="bg-primary px-4 py-3.5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Shield size={20} className="text-accent" />, title: "Qualidade", sub: "Marcas líderes" },
            { icon: <HelpCircle size={20} className="text-accent" />, title: "Consultoria", sub: "Ajuda especializada" },
            { icon: <Clock size={20} className="text-accent" />, title: "Horário", sub: "Seg–Sex 8h–18h" },
          ].map((item) => (
            <div key={item.title} className="bg-white/10 rounded-lg p-2.5 text-center hover:bg-white/15 transition-colors">
              <div className="flex justify-center mb-1.5">{item.icon}</div>
              <div className="text-xs font-bold text-white mb-0.5">{item.title}</div>
              <div className="text-[10px] text-white/55 leading-snug">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="p-4">
        <div className="text-base font-bold text-primary mb-3">Categorias</div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <SilverButton
              key={cat}
              onClick={() => setSelCat(cat)}
              variant={selCat === cat ? "solid" : "outline"}
              size="sm"
              className="rounded-full flex-shrink-0"
            >
              {cat}
            </SilverButton>
          ))}
        </div>
        {selCat !== "Todos" && (
          <div className="mt-2 text-xs text-muted-foreground">
            Mostrando {filteredProducts.length} produto(s) em &quot;{selCat}&quot;
          </div>
        )}
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-base font-bold text-primary flex items-center gap-2">
            <Zap size={18} className="text-accent" />
            Produtos em destaque
          </span>
          <SilverButton variant="ghost" size="sm" onClick={() => setPage("produtos")} iconRight={<ChevronRight size={14} />}>
            Ver todos
          </SilverButton>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {filteredProducts.slice(0, 4).map((p) => (
            <div key={p.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group">
              <div className="bg-gray-50 p-2 relative">
                <img src={p.imageUrl} alt={p.name} className="w-full h-24 object-contain transition-transform group-hover:scale-105" />
                <button
                  onClick={() => onToggleFavorite(p.id)}
                  className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    favorites.includes(p.id) ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart size={14} className={favorites.includes(p.id) ? "fill-current" : ""} />
                </button>
              </div>
              <div className="p-2.5 pb-3">
                <div className="text-[9px] font-bold text-primary uppercase">{p.category}</div>
                <div className="text-xs font-bold text-gray-800 my-0.5 leading-snug line-clamp-2">{p.name}</div>
                <div className="text-sm font-bold text-primary">{fmt(p.price)}</div>
                <SilverButton
                  onClick={() => onAddToCart(p)}
                  fullWidth
                  size="sm"
                  icon={<ShoppingCart size={12} />}
                  className="mt-2"
                >
                  Adicionar
                </SilverButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="bg-white p-4">
        <div className="flex justify-between items-start mb-3.5">
          <div>
            <div className="text-3xl font-bold text-primary leading-none">4,7</div>
            <div className="text-[11px] text-gray-500 mt-0.5">4.719 avaliações</div>
            <div className="text-[10px] text-primary font-semibold">Google Meu Negócio</div>
          </div>
          <div className="text-right">
            <StarRow size={14} />
            <div className="text-[11px] text-gray-500 mt-1">Loja de tintas · Campinas, SP</div>
          </div>
        </div>
        {REVIEWS.map((r) => (
          <div key={r.name} className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-2">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${r.bg} ${r.tc} flex items-center justify-center text-[11px] font-bold flex-shrink-0`}>
                  {r.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">{r.name}</div>
                  <StarRow size={11} />
                </div>
              </div>
              <div className="text-[10px] text-gray-400">{r.date}</div>
            </div>
            <div className="text-xs text-gray-600 leading-relaxed">&quot;{r.text}&quot;</div>
          </div>
        ))}
      </div>

      {/* ADDRESS */}
      <div className="bg-white border-t-4 border-primary p-4">
        <div className="text-sm font-bold text-primary mb-3">Visite nossa loja</div>
        <div className="flex gap-2.5 mb-2.5">
          <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-800 block text-[13px]">Av. Arymana, 299B</strong>
            Parque Universitário de Viracopos
            <br />
            Campinas – SP, 13056-464
          </div>
        </div>
        <div className="flex gap-2.5 mb-2.5">
          <Phone size={16} className="text-primary flex-shrink-0" />
          <div className="text-xs text-gray-600">
            <strong className="text-gray-800 text-[13px]">(19) 3266-0789</strong>
          </div>
        </div>
        <div className="flex gap-2.5 mb-3.5">
          <Clock size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 leading-relaxed">
            <span className="inline-block bg-red-50 text-red-700 rounded text-[10px] font-bold px-2 py-0.5 mb-1">Fechado agora</span>
            <br />
            Seg–Sex: 08:00 – 18:00
            <br />
            Sábado: 08:00 – 13:00
          </div>
        </div>
        <SilverButton
          onClick={() => window.open("https://maps.google.com/?q=Av.+Arymana,+299B+Campinas+SP", "_blank")}
          fullWidth
          icon={<MapPin size={16} />}
          iconRight={<ExternalLink size={14} />}
        >
          Ver no Google Maps
        </SilverButton>
      </div>
    </div>
  )
}

// ─── PRODUCTS PAGE ───────────────────────────────────────────────────────────

const ProductsPage = ({ 
  onAdd, 
  favorites, 
  onToggleFavorite 
}: { 
  onAdd: (p: Product) => void
  favorites: number[]
  onToggleFavorite: (id: number) => void
}) => {
  const [selCat, setSelCat] = useState("Todos")
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const filtered = selCat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === selCat)

  const handleAdd = (p: Product) => {
    setLoadingId(p.id)
    setTimeout(() => {
      onAdd(p)
      setLoadingId(null)
    }, 400)
  }

  return (
    <section className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-primary text-center mb-4 flex items-center justify-center gap-2">
        <Sparkles size={20} className="text-accent" />
        Produtos
      </h2>
      <div className="flex flex-wrap gap-2 justify-center mb-5">
        {CATEGORIES.map((cat) => (
          <SilverButton
            key={cat}
            onClick={() => setSelCat(cat)}
            variant={selCat === cat ? "solid" : "outline"}
            size="sm"
            className="rounded-full"
          >
            {cat}
          </SilverButton>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group">
            <div className="bg-gray-50 p-2.5 relative">
              <img src={p.imageUrl} alt={p.name} className="w-full h-28 object-contain transition-transform group-hover:scale-105" />
              <button
                onClick={() => onToggleFavorite(p.id)}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                  favorites.includes(p.id) ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart size={16} className={favorites.includes(p.id) ? "fill-current" : ""} />
              </button>
              <button
                onClick={() => navigator.share?.({ title: p.name, text: `Confira: ${p.name} - ${fmt(p.price)}` }) || navigator.clipboard.writeText(p.name)}
                className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center transition-all shadow-md hover:text-primary hover:bg-blue-50"
              >
                <Share2 size={14} />
              </button>
            </div>
            <div className="p-2.5 pb-3">
              <div className="text-[9px] font-bold text-primary uppercase mb-0.5">{p.category}</div>
              <div className="text-[13px] font-bold text-gray-800 mb-1 leading-snug line-clamp-2">{p.name}</div>
              <div className="text-[15px] font-bold text-primary mb-2">{fmt(p.price)}</div>
              <SilverButton
                onClick={() => handleAdd(p)}
                loading={loadingId === p.id}
                fullWidth
                size="sm"
                icon={<ShoppingCart size={14} />}
              >
                Adicionar
              </SilverButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── COLOR PAGE ───────────────────────────────────────────────────────────────

const ColorPage = () => {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSearch = () => {
    if (!code) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setResult(`Cor encontrada para ${code}: Preto Metálico Brilhante`)
    }, 1500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <section className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold text-primary text-center mb-5 flex items-center justify-center gap-2">
        <Paintbrush size={22} className="text-accent" />
        Consultar Código da Cor
      </h2>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <label className="block mb-2 font-semibold text-[13px] text-gray-700">Digite o código da peça do carro</label>
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex: NH731P"
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary uppercase"
          />
          {code && (
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary p-1 transition-colors"
            >
              <Copy size={16} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 mt-3.5">
          <SilverButton
            onClick={handleSearch}
            loading={loading}
            fullWidth
            icon={<Search size={16} />}
          >
            Consultar Cor
          </SilverButton>
          <SilverButton
            onClick={() => { setCode(""); setResult(null) }}
            variant="outline"
            icon={<RefreshCw size={16} />}
          >
            Limpar
          </SilverButton>
        </div>

        {result && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-2">
            <Check size={18} />
            {result}
          </div>
        )}
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold text-primary text-sm mb-2 flex items-center gap-2">
          <HelpCircle size={16} />
          Onde encontrar o código?
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          O código da cor geralmente está localizado na etiqueta de identificação do veículo, na porta do motorista ou no manual do proprietário.
        </p>
      </div>
    </section>
  )
}

// ─── CART MODAL ────────────────────────────────────────────────��──────────────

const CartModal = ({
  cart,
  onClose,
  onRemove,
  onChangeQty,
  onCheckout,
}: {
  cart: CartItem[]
  onClose: () => void
  onRemove: (id: number) => void
  onChangeQty: (id: number, delta: number) => void
  onCheckout: () => void
}) => {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div className="fixed inset-0 bg-black/45 flex justify-center items-center z-[200]">
      <div className="bg-white w-[360px] max-w-[90vw] rounded-xl p-5 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-primary">Carrinho</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500 text-sm">Carrinho vazio</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{fmt(item.price)}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => onChangeQty(item.id, -1)} className="w-6 h-6 border border-gray-300 rounded bg-white cursor-pointer text-sm hover:bg-gray-100">
                      −
                    </button>
                    <span className="text-[13px] font-semibold">{item.qty}</span>
                    <button onClick={() => onChangeQty(item.id, 1)} className="w-6 h-6 border border-gray-300 rounded bg-white cursor-pointer text-sm hover:bg-gray-100">
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)} className="bg-transparent border-none cursor-pointer text-gray-400 text-xs ml-2 hover:text-red-500">
                  remover
                </button>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 font-bold text-base flex justify-between">
              <span>Total</span>
              <span className="text-primary">{fmt(subtotal)}</span>
            </div>
          </>
        )}
        <div className="flex gap-2.5 mt-4">
          <SilverButton onClick={onClose} variant="outline" className="flex-1">
            Fechar
          </SilverButton>
          {cart.length > 0 && (
            <SilverButton onClick={onCheckout} className="flex-1" icon={<ShoppingCart size={16} />}>
              Pagar
            </SilverButton>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── CART PAGE (STEP 1) ───────────────────────────────────────────────────────

const CartPage = ({
  cart,
  onRemove,
  onChangeQty,
  onNext,
}: {
  cart: CartItem[]
  onRemove: (id: number) => void
  onChangeQty: (id: number, delta: number) => void
  onNext: () => void
}) => {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <section className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-primary">Seu carrinho</h2>
      <p className="text-xs text-gray-500 mb-4">Revise seus produtos e prossiga com a compra.</p>

      {cart.length === 0 && <p className="text-gray-500 text-sm text-center py-8">Carrinho vazio</p>}

      {cart.map((item, idx) => (
        <div
          key={item.id}
          className={`bg-white rounded-lg border-2 p-3 mb-3 flex gap-3 items-center transition-all ${idx === 0 ? "border-primary shadow-md" : "border-gray-200"}`}
        >
          <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-contain rounded" />
          <div className="flex-1">
            <div className="text-[13px] font-bold text-gray-800">{item.name}</div>
            {item.ref && <div className="text-[11px] text-gray-500">{item.ref}</div>}
            <div className="flex items-center gap-2 mt-1.5">
              <button onClick={() => onChangeQty(item.id, -1)} className="w-6 h-6 border border-gray-300 rounded bg-white cursor-pointer text-sm hover:bg-gray-100">
                −
              </button>
              <span className="text-[13px] font-semibold px-2 py-0.5 border border-gray-200 rounded bg-gray-50">{item.qty}</span>
              <button onClick={() => onChangeQty(item.id, 1)} className="w-6 h-6 border border-gray-300 rounded bg-white cursor-pointer text-sm hover:bg-gray-100">
                +
              </button>
            </div>
            <div className="text-sm font-bold text-primary mt-1">{fmt(item.price * item.qty)}</div>
          </div>
          <button onClick={() => onRemove(item.id)} className="bg-transparent border-none cursor-pointer text-gray-400 text-xl leading-none hover:text-red-500">
            ×
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <div className="bg-white rounded-lg p-3.5 mt-2">
            <div className="flex justify-between text-[13px] py-1 text-gray-600">
              <span>Subtotal</span>
              <span className="text-gray-800 font-semibold">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13px] py-1 text-gray-600">
              <span>Frete</span>
              <span className="text-primary text-xs cursor-pointer underline">Calcular</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-2.5 mt-1.5">
              <span>TOTAL</span>
              <span className="text-primary">{fmt(subtotal)}</span>
            </div>
          </div>
          <SilverButton
            onClick={onNext}
            fullWidth
            size="lg"
            iconRight={<ChevronRight size={18} />}
            className="mt-3.5"
          >
            FINALIZAR COMPRA
          </SilverButton>
          <div className="text-center mt-2 text-[11px] text-gray-500 flex items-center justify-center gap-1">
            <Check size={13} className="text-emerald-500" /> Compra 100% segura
          </div>
        </>
      )}
    </section>
  )
}

// ─── PAYMENT PAGE (STEP 2) ────────────────────────────────────────────────────

const PaymentPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [payMethod, setPayMethod] = useState<"cc" | "pix" | "boleto">("cc")

  return (
    <section className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-primary">Identificação e Pagamento</h2>
      <p className="text-xs text-gray-500 mb-4">Preencha seus dados e informe a forma de pagamento.</p>

      <div className="text-sm font-bold text-gray-800 mt-4 mb-2">Dados pessoais</div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input placeholder="Nome completo" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
        <input placeholder="CPF" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
        <input placeholder="Email" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
        <input placeholder="Telefone" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
      </div>

      <div className="text-sm font-bold text-gray-800 mt-4 mb-2">Endereço de entrega</div>
      <div className="grid grid-cols-[0.6fr_1.4fr] gap-2 mb-2">
        <input placeholder="CEP" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
        <input placeholder="Rua" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
      </div>
      <div className="grid grid-cols-[0.6fr_1fr_1fr] gap-2 mb-4">
        <input placeholder="Número" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
        <input placeholder="Complemento" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
        <input placeholder="Bairro" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
      </div>

      <div className="text-sm font-bold text-gray-800 mt-4 mb-1">Pagamento</div>
      <p className="text-[11px] text-gray-500 mb-2.5">Todas as transações são seguras e criptografadas.</p>

      <div className="flex gap-2 mb-3.5">
        {(["cc", "pix", "boleto"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setPayMethod(m)}
            className={`flex-1 border rounded-md py-2 text-xs cursor-pointer font-medium transition-all ${
              payMethod === m ? "border-primary bg-blue-50 text-primary border-2" : "border-gray-300 bg-white text-gray-600 hover:border-primary"
            }`}
          >
            {m === "cc" ? "Cartão de crédito" : m === "pix" ? "PIX" : "Boleto"}
          </button>
        ))}
      </div>

      {payMethod === "cc" && (
        <div className="bg-white rounded-lg border border-gray-200 p-3.5 mb-2">
          <input placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-[13px] mb-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          <input placeholder="Nome no cartão" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-[13px] mb-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="MM/AA" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
            <input placeholder="CVV" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
            <input placeholder="CPF do titular" className="border border-gray-300 rounded-md px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
        </div>
      )}

      <SilverButton
        onClick={onNext}
        fullWidth
        size="lg"
        iconRight={<ChevronRight size={18} />}
        className="mt-3.5"
      >
        FINALIZAR COMPRA
      </SilverButton>
      <div onClick={onBack} className="text-xs text-primary cursor-pointer mt-3 flex items-center gap-1 hover:underline">
        ‹ Voltar para o carrinho
      </div>
    </section>
  )
}

// ─── CONFIRMATION PAGE (STEP 3) ───────────────────────────────────────────────

const ConfirmPage = ({ cart, onContinue }: { cart: CartItem[]; onContinue: () => void }) => {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const frete = 18.7

  return (
    <section className="p-4 max-w-md mx-auto">
      {/* hero */}
      <div className="text-center py-6 px-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3.5">
          <Check size={32} className="text-emerald-600" />
        </div>
        <div className="text-lg font-bold text-primary mb-1.5">Pedido confirmado!</div>
        <div className="text-xs text-gray-600 leading-relaxed">
          Obrigado pela sua compra na Silver Tintas.
          <br />
          Seu pedido <strong>#BT4627</strong> foi recebido com sucesso.
        </div>
      </div>

      {/* delivery */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 mb-4 flex gap-3 items-center">
        <Truck size={32} className="text-amber-600 flex-shrink-0" />
        <div>
          <div className="text-[11px] text-gray-500 mb-0.5">Previsão de entrega</div>
          <div className="text-sm font-bold text-gray-800">de 27/04 a 30/04</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Enviaremos um e-mail com os detalhes.</div>
        </div>
      </div>

      {/* summary */}
      <div className="text-sm font-bold text-gray-800 mb-2">Resumo do pedido:</div>
      <div className="flex gap-3">
        <div className="flex-1">
          {cart.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-2.5 mb-2 flex gap-2.5 items-center">
              <img src={item.imageUrl} alt={item.name} className="w-11 h-11 object-contain flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[11px] font-bold text-gray-800 line-clamp-1">{item.name}</div>
                <div className="text-xs text-gray-500">Qtd: {item.qty}</div>
                <div className="text-xs font-bold text-primary">{fmt(item.price * item.qty)}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="bg-white rounded-lg p-3 min-w-[140px] text-[13px]">
            <div className="flex justify-between py-0.5 text-gray-600">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between py-0.5 text-gray-600">
              <span>Frete</span>
              <span>{fmt(frete)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-2 mt-1">
              <span>TOTAL</span>
              <span className="text-primary">{fmt(subtotal + frete)}</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg px-3 py-2.5 mt-2.5 text-[11px] text-primary flex items-start gap-1.5">
            <Mail size={16} className="flex-shrink-0" />
            Enviamos os detalhes para seu e-mail
          </div>
        </div>
      </div>

      <SilverButton
        onClick={onContinue}
        fullWidth
        size="lg"
        icon={<ShoppingCart size={18} />}
        iconRight={<ChevronRight size={18} />}
        className="mt-5"
      >
        CONTINUAR COMPRANDO
      </SilverButton>
    </section>
  )
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<"home" | "produtos" | "cor" | "cart" | "pagamento" | "confirmacao">("home")
  const [cart, setCart] = useState<CartItem[]>([
    { ...PRODUCTS[0], qty: 1 },
    { ...PRODUCTS[9], qty: 1 },
  ])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  const showToast = useCallback((message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type })
  }, [])

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id)
      if (existing) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { ...p, qty: 1 }]
    })
    showToast(`${p.name} adicionado ao carrinho!`, "success")
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        showToast("Removido dos favoritos", "info")
        return prev.filter((i) => i !== id)
      }
      showToast("Adicionado aos favoritos!", "success")
      return [...prev, id]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
    showToast("Produto removido do carrinho", "error")
  }

  const changeQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)))
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const checkoutStep = page === "cart" ? 1 : page === "pagamento" ? 2 : page === "confirmacao" ? 3 : 0

  return (
    <div className="min-h-screen bg-gray-100">
      <Header page={page} setPage={(p) => setPage(p as typeof page)} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      {checkoutStep > 0 && <Steps current={checkoutStep} />}

      {page === "home" && <HomePage setPage={(p) => setPage(p as typeof page)} onAddToCart={addToCart} favorites={favorites} onToggleFavorite={toggleFavorite} />}
      {page === "produtos" && <ProductsPage onAdd={addToCart} favorites={favorites} onToggleFavorite={toggleFavorite} />}
      {page === "cor" && <ColorPage />}
      {page === "cart" && <CartPage cart={cart} onRemove={removeFromCart} onChangeQty={changeQty} onNext={() => setPage("pagamento")} />}
      {page === "pagamento" && <PaymentPage onNext={() => setPage("confirmacao")} onBack={() => setPage("cart")} />}
      {page === "confirmacao" && (
        <ConfirmPage
          cart={cart}
          onContinue={() => {
            setCart([])
            setPage("home")
          }}
        />
      )}

      <Footer />

      {cartOpen && (
        <CartModal
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onChangeQty={changeQty}
          onCheckout={() => {
            setCartOpen(false)
            setPage("cart")
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
