import axios from "axios"

const api = axios.create({
  baseURL: "https://api-chamados.jefersonqueiroga.com.br",
  headers: { "X-API-Key": import.meta.env.VITE_API_KEY },
})

export function mensagemErro(erro) {
  const detail = erro.response?.data?.detail

  if (!erro.response) return "Não foi possível conectar à API."
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ") 
  if (typeof detail === "string") return detail
  if (erro.response.status === 401) return "Chave inválida. Verifique sua chave."
  return "Ocorreu um erro."
}

export default api
