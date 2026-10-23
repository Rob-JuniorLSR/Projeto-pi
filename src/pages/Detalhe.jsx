import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api, { mensagemErro } from "../services/api"

export default function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [chamado, setChamado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [texto, setTexto] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get(`/chamados/${id}`)
        setChamado(resposta.data)
      } catch (erro) {
        setErro(mensagemErro(erro))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  async function excluir() {
    if (!window.confirm("Tem certeza que deseja excluir este chamado?")) return
    try {
      await api.delete(`/chamados/${id}`)
      navigate("/")
    } catch (erro) {
      setErro(mensagemErro(erro))
    }
  }

  async function proximaEtapa(e) {
    e.preventDefault()
    setErro("")
    try {
      let resposta
      if (chamado.status === "aberto") {
        resposta = await api.patch(`/chamados/${id}/iniciar`, { responsavel: texto })
      } else {
        resposta = await api.patch(`/chamados/${id}/resolver`, { solucao: texto })
      }
      setChamado(resposta.data)
      setTexto("")
    } catch (erro) {
      setErro(mensagemErro(erro))
    }
  }

  if (carregando) return <p>Carregando...</p>
  if (!chamado) return <p className="erro">{erro}</p>

  return (
    <div>
      <Link to="/">← Voltar</Link>

      <h1>{chamado.titulo}</h1>
      <p>{chamado.status} · prioridade {chamado.prioridade}</p>

      <p><b>Descrição:</b> {chamado.descricao}</p>
      <p><b>Tipo:</b> {chamado.tipo}</p>
      <p><b>Local:</b> {chamado.local}</p>
      <p><b>Aberto em:</b> {chamado.data_abertura}</p>
      <p><b>Responsável:</b> {chamado.responsavel}</p>
      <p><b>Solução:</b> {chamado.solucao}</p>

      {erro && <p className="erro">{erro}</p>}

      <div className="linha">
        {/* resolvido não pode ser editado */}
        {chamado.status !== "resolvido" && (
          <Link className="botao" to={`/editar/${id}`}>Editar</Link>
        )}
        <button className="vermelho" onClick={excluir}>Excluir</button>
      </div>

      {}
      {chamado.status !== "resolvido" && (
        <form onSubmit={proximaEtapa} className="etapa">
          <h2>Próxima etapa</h2>
          <input
            placeholder={chamado.status === "aberto" ? "Responsável" : "Solução"}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            required
          />
          <button>
            {chamado.status === "aberto" ? "Iniciar" : "Resolver"}
          </button>
        </form>
      )}
    </div>
  )
}
