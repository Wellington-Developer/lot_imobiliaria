import React, { useContext, useEffect, useState } from "react";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../../Hooks/useForm";
import { useFetch } from "../../../Hooks/useFetch";
import { Input } from "../../Forms/Input";
import { UserContext } from "../../../UserContext";
import { PHOTO_EDIT } from "../../../api";

export const EditPost = () => {
  const [res, setRes] = useState(false);
  const { id } = useParams();
  const { posts } = useContext(UserContext);
  const status_do_imovel = useForm();
  const preco = useForm();
  const titulo = useForm();
  const localidade = useForm();
  const breve_descricao = useForm();
  const texto_adicional = useForm();
  const cidade = useForm();
  const bairro = useForm();
  const descricao_completa = useForm();
  const qtd_salas = useForm();
  const qtd_banheiros = useForm();
  const qtd_quartos = useForm();
  const qtd_vagas = useForm();
  const metros_privativos = useForm();
  const metros_totais = useForm();
  const informacao_adicional_titulo = useForm();
  const informacao_adicional_paragrafo = useForm();
  const [imgs, setImgs] = useState([]);
  const [features, setFeatures] = useState([]);
  const { error, loading, request } = useFetch();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("");
  const [locacaoOuVenda, setLocacaoOuVenda] = useState("");
  const tipos = [
    "Apartamento",
    "Casa",
    "Sobrado",
    "Kitnet",
    "Chalé",
    "Loft",
    "Duplex",
    "Triplex",
    "Flat",
    "Cobertura",
    "Terreno",
    "Comercial",
  ];
  const locacaoOuVendaOptions = ["Locacao", "Venda"];
  const [coverImage, setCoverImage] = useState(null);

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleTextareaKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Impede o comportamento padrão de enviar o formulário
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      // Insere uma quebra de linha na posição do cursor
      textarea.value = value.substring(0, start) + "\n" + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 1; // Coloca o cursor após a quebra de linha
    }
  };

  const navigateUserToHome = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (coverImage) {
      formData.append("cover_image", coverImage); // Include cover image in formData
    }
    formData.append("cidade", cidade.value);
    formData.append("bairro", bairro.value);
    formData.append("tipo", tipo);
    formData.append("status_do_imovel", status_do_imovel.value);
    formData.append("locacao_ou_venda", locacaoOuVenda);
    formData.append("preco", preco.value);
    formData.append("titulo", titulo.value);
    formData.append("localidade", localidade.value);
    formData.append("breve_descricao", breve_descricao.value);
    formData.append("texto_adicional", texto_adicional.value);
    formData.append("descricao_completa", descricao_completa.value);
    formData.append("qtd_salas", qtd_salas.value);
    formData.append("qtd_banheiros", qtd_banheiros.value);
    formData.append("qtd_quartos", qtd_quartos.value);
    formData.append("qtd_vagas", qtd_vagas.value);
    formData.append("metros_privativos", metros_privativos.value);
    formData.append("metros_totais", metros_totais.value);
    formData.append(
      "informacao_adicional_titulo",
      informacao_adicional_titulo.value
    );
    formData.append(
      "informacao_adicional_paragrafo",
      informacao_adicional_paragrafo.value
    );

    formData.append("features", features.join(","));

    imgs.forEach((img, index) => {
      formData.append(`img${index + 1}`, img);
    });

    const token = window.localStorage.getItem("token");
    const { url, options } = PHOTO_EDIT(formData, token, id);

    try {
      const response = await request(url, options);

      if (response.ok) {
        console.log("Post atualizado com sucesso:", data);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setRes(true);
      console.log(res);
    }
  };

  console.log(res);

  const handleImgChange = (e) => {
    const selectedImgs = Array.from(e.target.files);
    setImgs(selectedImgs);
  };

  useEffect(() => {
    if (res) {
      navigateUserToHome();
    }
  }, [res]);

  const getFilterPost = () => {
    if (posts) {
      const filteredPost = posts.find((post) => post.id == id);

      if (filteredPost) {
        status_do_imovel.setValue(filteredPost.status_do_imovel);
        preco.setValue(filteredPost.preco);
        titulo.setValue(filteredPost.title);
        localidade.setValue(filteredPost.localidade);
        breve_descricao.setValue(filteredPost.breve_descricao);
        texto_adicional.setValue(filteredPost.texto_adicional);
        descricao_completa.setValue(filteredPost.descricao_completa);
        cidade.setValue(filteredPost.cidade);
        bairro.setValue(filteredPost.bairro);
        qtd_salas.setValue(filteredPost.qtd_salas);
        qtd_banheiros.setValue(filteredPost.qtd_banheiros);
        qtd_vagas.setValue(filteredPost.qtd_vagas);
        qtd_quartos.setValue(filteredPost.qtd_quartos);
        metros_privativos.setValue(filteredPost.metros_privativos);
        metros_totais.setValue(filteredPost.metros_totais);
        informacao_adicional_titulo.setValue(
          filteredPost.informacao_adicional_titulo
        );
        informacao_adicional_paragrafo.setValue(
          filteredPost.informacao_adicional_paragrafo
        );

        // Verificar se as propriedades existem antes de chamar split
        setFeatures(
          filteredPost.features ? filteredPost.features.split(",") : []
        );

        setTipo(filteredPost.tipo);
        setLocacaoOuVenda(filteredPost.locacao_ou_venda);
      }
    }
  };

  useEffect(() => {
    getFilterPost();
  }, [id]);

  return (
    <div className="post-edit__container">
      <form onSubmit={handleSubmit}>
        <Input label="Titulo" name="titulo" type="text" {...titulo} />
        <select
          id="status_do_imovel"
          value={status_do_imovel.value}
          onChange={status_do_imovel.onChange}
        >
          <option value="">Selecione o status</option>
          <option value="Locado">Locado</option>
          <option value="Vendido">Vendido</option>
          <option value="Reservado">Reservado</option>
          <option value="Disponivel">Disponível</option>
        </select>
        <Input label="Preço" name="preco" type="number" {...preco} />
        <Input
          label="Localidade"
          name="localidade"
          type="text"
          {...localidade}
        />
        <Input
          label="Coloque as caracteristicas da casa separadas por virgula"
          name="features"
          type="text"
          value={features.join(",")} // Mostrar as features separadas por vírgula
          onChange={(e) => setFeatures(e.target.value.split(","))}
        />

        <div className="form-control">
          <label htmlFor="texto_adicional">
            Texto adicional abaixo do valor:
          </label>
          <textarea
            id="texto_adicional"
            name="texto_adicional"
            {...texto_adicional}
            onKeyDown={handleTextareaKeyPress}
          />
        </div>

        <div className="form-control">
          <label htmlFor="descricao_completa">Descrição completa:</label>
          <textarea
            id="descricao_completa"
            name="descricao_completa"
            {...descricao_completa}
            onKeyDown={handleTextareaKeyPress}
          />
        </div>

        <div className="form-control">
          <label htmlFor="breve_descricao">Breve descrição:</label>
          <textarea
            id="breve_descricao"
            name="breve_descricao"
            {...breve_descricao}
            onKeyDown={handleTextareaKeyPress}
          />
        </div>
        <Input label="Cidade" name="cidade" type="text" {...cidade} />
        <Input label="Bairro" name="bairro" type="text" {...bairro} />
        <Input
          label="Quantidade de salas"
          name="qtd_salas"
          type="number"
          {...qtd_salas}
        />
        <Input
          label="Quantidade de banheiros"
          name="qtd_banheiros"
          type="number"
          {...qtd_banheiros}
        />
        <Input
          label="Quantidade de quartos"
          name="qtd_quartos"
          type="number"
          {...qtd_quartos}
        />
        <Input
          label="Quantidade de vagas na garagem"
          name="qtd_vagas"
          type="number"
          {...qtd_vagas}
        />
        <Input
          label="Metros privativos totais"
          name="metros_privativos"
          type="text"
          {...metros_privativos}
        />
        <Input
          label="Metros totais"
          name="metros_totais"
          type="text"
          {...metros_totais}
        />
        <Input
          label="Titulo informações adicionais"
          name="informacao_adicional_titulo"
          type="text"
          {...informacao_adicional_titulo}
        />
        <Input
          label="Texto informações adicionais"
          name="informacao_adicional_paragrafo"
          type="text"
          {...informacao_adicional_paragrafo}
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Selecione o tipo</option>
          {tipos.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={locacaoOuVenda}
          onChange={(e) => setLocacaoOuVenda(e.target.value)}
        >
          <option value="">Locação ou Venda?</option>
          {locacaoOuVendaOptions.map((locv) => (
            <option key={locv} value={locv}>
              {locv}
            </option>
          ))}
        </select>
        <div id="arquivos">
          <label htmlFor="arquivo">Enviar arquivos</label>
          <input
            type="file"
            multiple
            onChange={handleImgChange}
            name="arquivo"
            id="arquivo"
          />
        </div>
        <div id="cover_image">
          <label htmlFor="coverImage">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            name="cover_image"
            id="cover_image"
          />
        </div>
        {loading ? (
          <button>Fazendo postagem</button>
        ) : (
          <button>Fazer postagem</button>
        )}
        {<p id="error">{error}</p>}
      </form>
    </div>
  );
};
