import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api, { mensagemErro } from "../services/api"

export default function Formulario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id) 

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState("")
  const [local, setLocal] = useState("")
  const [prioridade, setPrioridade] = useState("")
  const [dataAbertura, setDataAbertura] = useState("")

  const [tipos, setTipos] = useState([])
  const [locais, setLocais] = useState([])
  const [prioridades, setPrioridades] = useState([])

  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const t = await api.get("/tipos")
        const l = await api.get("/locais")
        const p = await api.get("/prioridades")
        setTipos(t.data)
        setLocais(l.data)
        setPrioridades(p.data)

        if (editando) {
          const resposta = await api.get(`/chamados/${id}`)
          const c = resposta.data
          if (c.status === "resolvido") {
            setErro("Chamado resolvido não pode ser editado.")
            return
          }
          setTitulo(c.titulo)
          setDescricao(c.descricao)
          setTipo(c.tipo)
          setLocal(c.local)
          setPrioridade(c.prioridade)
          setDataAbertura(c.data_abertura)
        }
      } catch (erro) {
        setErro(mensagemErro(erro))
      }
    }
    carregar()
  }, [id, editando])

  async function salvar(e) {
    e.preventDefault()
    setErro("")
    setSucesso("")

    const dados = {
      titulo,
      descricao,
      tipo,
      local,
      prioridade,
      data_abertura: dataAbertura,
    }

    try {
      if (editando) {
        await api.put(`/chamados/${id}`, dados)
      } else {
        await api.post("/chamados", dados)
      }
      setSucesso("Chamado salvo com sucesso!")
      setTimeout(() => navigate("/"), 1000)
    } catch (erro) {
      setErro(mensagemErro(erro))
    }
  }

  return (
    <div>
      <h1>{editando ? "Editar chamado" : "Abrir chamado"}</h1>

      <form onSubmit={salvar}>
        <label>Título</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

        <label>Descrição</label>
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />

        <label>Tipo</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          <option value="">Selecione</option>
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <label>Local</label>
        <select value={local} onChange={(e) => setLocal(e.target.value)} required>
          <option value="">Selecione</option>
          {locais.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <label>Prioridade</label>
        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} required>
          <option value="">Selecione</option>
          {prioridades.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <label>Data de abertura</label>
        <input
          type="date"
          value={dataAbertura}
          onChange={(e) => setDataAbertura(e.target.value)}
          required
        />

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p className="sucesso">{sucesso}</p>}

        <div className="linha">
          <button>Salvar</button>
          <Link to="/">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
