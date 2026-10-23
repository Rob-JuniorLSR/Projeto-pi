import { useEffect, useState } from "react"
import { Routes, Route, Link } from "react-router-dom"
import api from "./services/api"
import Home from "./pages/Home"
import Detalhe from "./pages/Detalhe"
import Formulario from "./pages/Formulario"

export default function App() {
  const [dono, setDono] = useState(null)

  useEffect(() => {
    async function carregarDono() {
      try {
        const resposta = await api.get("/eu")
        setDono(resposta.data)
      } catch (erro) {
        setDono(null)
      }
    }
    carregarDono()
  }, [])

  return (
    <>
      <header className="topo">
        <Link to="/">Manutenção IFRN</Link>
        <span>Olá, {dono ? dono.nome : "..."}</span>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chamado/:id" element={<Detalhe />} />
          <Route path="/novo" element={<Formulario />} />
          <Route path="/editar/:id" element={<Formulario />} />
        </Routes>
      </main>
    </>
  )
}
