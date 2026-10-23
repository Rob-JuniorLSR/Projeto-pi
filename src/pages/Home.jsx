import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api, { mensagemErro } from "../services/api"

export default function Home() {
  const [chamados, setChamados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [tipo, setTipo] = useState("")
  const [local, setLocal] = useState("")
  const [prioridade, setPrioridade] = useState("")

  const [tipos, setTipos] = useState([])
  const [locais, setLocais] = useState([])
  const [prioridades, setPrioridades] = useState([])

  useEffect(() => {
    async function carregarListas() {
      try {
        const t = await api.get("/tipos")
        const l = await api.get("/locais")
        const p = await api.get("/prioridades")
        setTipos(t.data)
        setLocais(l.data)
        setPrioridades(p.data)
      } catch (erro) {
        setErro(mensagemErro(erro))
      }
    }
    carregarListas()
  }, [])

  useEffect(() => {
    async function carregarChamados() {
      setCarregando(true)
      setErro("")
      try {

        const params = {}
        if (busca) params.busca = busca
        if (status) params.status = status
        if (tipo) params.tipo = tipo
        if (local) params.local = local
        if (prioridade) params.prioridade = prioridade

        const resposta = await api.get("/chamados", { params })
        setChamados(resposta.data)
      } catch (erro) {
        setErro(mensagemErro(erro))
      } finally {
        setCarregando(false)
      }
    }
    carregarChamados()
  }, [busca, status, tipo, local, prioridade])

  return (
    <div>
      <div className="linha">
        <h1>Chamados</h1>
        <Link className="botao" to="/novo">+ Abrir chamado</Link>
      </div>

      <input
        placeholder="Buscar por título ou descrição..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="filtros">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="aberto">aberto</option>
          <option value="em andamento">em andamento</option>
          <option value="resolvido">resolvido</option>
        </select>

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Tipo</option>
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Local</option>
          {locais.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
          <option value="">Prioridade</option>
          {prioridades.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando chamados...</p>}
      {erro && <p className="erro">{erro}</p>}
      {!carregando && !erro && chamados.length === 0 && (
        <p>Nenhum chamado encontrado.</p>
      )}

      {chamados.map((c) => (
        <Link key={c.id} to={`/chamado/${c.id}`} className="card">
          <strong>{c.titulo}</strong>
          <span>{c.status} · prioridade {c.prioridade}</span>
        </Link>
      ))}
    </div>
  )
}
