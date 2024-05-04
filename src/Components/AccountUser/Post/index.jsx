import { Input } from '../../Forms/Input'
import { useForm } from '../../../Hooks/useForm'
import { useFetch } from '../../../Hooks/useFetch'
import { PHOTO_POST } from '../../../api'
import { useContext, useEffect, useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../../UserContext'

export const Post = () => {
  const numeroImovel = useForm();
  const status_do_imovel = useForm();
  const preco = useForm();
  const titulo = useForm();
  const localidade = useForm();
  const breve_descricao = useForm();
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
  const texto_adicional = useForm();
  const { data, error, loading, request } = useFetch()
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('');
  const [locacaoOuVenda, setLocacaoOuVenda] = useState('');
  const [ cep, setCep ] = useState('')
  const tipos = ['Apartamento', 'Casa', 'Sobrado', 'Kitnet', 'Chalé', 'Loft', 'Duplex', 'Triplex', 'Flat', 'Cobertura', 'Terreno', 'Comercial'];
  const locacaOuVenda = ['Locacao', 'Venda'];
  const statusOptions = ["", "Locado", "Vendido", "Reservado", "Disponivel"];
  const { filterPosts } = useContext(UserContext)
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    if(data) navigate('/accountuser');
  }, [data, navigate])

  const handleCepChange = (e) => {
    const newCep = e.target.value;
    setCep(newCep);
  
    if (newCep.length === 8) {
      const apiUrl = `https://viacep.com.br/ws/${newCep}/json/`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          bairro.setValue(data.bairro);
          cidade.setValue(data.localidade);
          localidade.setValue(`${data.logradouro}, ${numeroImovel.value}, ${data.bairro} - ${data.localidade}`);
        })
        .catch(error => console.error('Erro ao buscar dados do CEP:', error));
    }
  };

  const handleTextareaKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Impede o comportamento padrão de enviar o formulário
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      // Insere uma quebra de linha na posição do cursor
      textarea.value = value.substring(0, start) + '\n' + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 1; // Coloca o cursor após a quebra de linha
    }
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (coverImage) {
      formData.append('cover_image', coverImage);
    }
    formData.append('cidade', cidade.value);
    formData.append('bairro', bairro.value);
    formData.append('tipo', tipo);
    formData.append('status_do_imovel', status_do_imovel.value);
    formData.append('locacao_ou_venda', locacaoOuVenda);
    formData.append('preco', preco.value);
    formData.append('titulo', titulo.value);
    formData.append('localidade', localidade.value);
    formData.append('breve_descricao', breve_descricao.value);
    formData.append('descricao_completa', descricao_completa.value);
    formData.append('qtd_salas', qtd_salas.value);
    formData.append('qtd_banheiros', qtd_banheiros.value);
    formData.append('qtd_quartos', qtd_quartos.value);
    formData.append('qtd_vagas', qtd_vagas.value);
    formData.append('metros_privativos', metros_privativos.value);
    formData.append('metros_totais', metros_totais.value);
    formData.append('informacao_adicional_titulo', informacao_adicional_titulo.value);
    formData.append('informacao_adicional_paragrafo', informacao_adicional_paragrafo.value);
    formData.append('numero_imovel', numeroImovel.value);
  
    // Enviar features como um array
    formData.append('features', features.join(','));
    formData.append('texto_adicional', texto_adicional.value);
  
    imgs.forEach((img, index) => {
      formData.append(`img${index + 1}`, img);
    });
  
    const token = window.localStorage.getItem('token');
    const { url, options } = PHOTO_POST(formData, token);
    request(url, options)
    .then(() => {
      filterPosts(tipo, cidade.value, bairro.value);
    })
  };
  
  const handleImgChange = (e) => {
    const selectedImgs = Array.from(e.target.files);
    setImgs(selectedImgs);
  };

  return (
    <div className="animeLeft container-form__post">
      <form onSubmit={handleSubmit}>
        <Input label="Número do endereço do Imóvel" name="numero_imovel" type="text" {...numeroImovel} />
        <Input label="CEP" name="cep" type="text" value={cep} onChange={handleCepChange} />
        <Input label="Localidade" name="localidade" type="text" {...localidade}/>
        <Input label="Cidade" name="cidade" type="text" {...cidade}/>
        <Input label="Bairro" name="bairro" type="text" {...bairro}/>
        <Input label="Titulo" name="titulo" type="text" {...titulo}/>
        <select
            id="status_do_imovel"
            value={status_do_imovel.value}
            onChange={status_do_imovel.onChange}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option === "" ? "Selecione o status" : option}
              </option>
            ))}
        </select>
        <Input label="Preço" name="preco" type="number" {...preco}/>
        <Input
          label="Coloque as caracteristicas da casa separadas por virgula"
          name="features"
          type="text"
          value={features.join(',')} // Mostrar as features separadas por vírgula
          onChange={(e) => setFeatures(e.target.value.split(','))}
        />
        <div className="form-control">
          <label htmlFor="texto_adicional">Texto adicional abaixo do valor:</label>
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
        <Input label="Quantidade de salas" name="qtd_salas" type="number" {...qtd_salas}/>
        <Input label="Quantidade de banheiros" name="qtd_banheiros" type="number" {...qtd_banheiros}/>
        <Input label="Quantidade de quartos" name="qtd_quartos" type="number" {...qtd_quartos}/>
        <Input label="Quantidade de vagas na garagem" name="qtd_vagas" type="number" {...qtd_vagas}/>
        <Input label="Metros privativos totais" name="metros_privativos" type="text" {...metros_privativos}/>
        <Input label="Metros totais" name="metros_totais" type="text" {...metros_totais}/>
        <Input label="Titulo informações adicionais" name="informacao_adicional_titulo" type="text" {...informacao_adicional_titulo}/>
        <Input label="Texto informações adicionais" name="informacao_adicional_paragrafo" type="text" {...informacao_adicional_paragrafo}/>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Selecione o tipo</option>
          {tipos.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select value={locacaoOuVenda} onChange={(e) => setLocacaoOuVenda(e.target.value)}>
          <option value="">Locação ou Venda?</option>
          {locacaOuVenda.map((locv) => (
            <option key={locv} value={locv}>
              {locv}
            </option>
          ))}
        </select>
        <div id="arquivos">
          <label for="arquivo">Enviar arquivos</label>
          <input type="file" multiple onChange={handleImgChange} name="arquivo" id="arquivo"/>
        </div>
        {
          <p id="error">{error}</p>
        }
        <div id="cover_image">
          <label htmlFor="cover_image">Foto da Capa</label>
          <input type="file" accept="image/*" onChange={handleCoverImageChange} name="cover_image" id="cover_image"/>
        </div>
        <button>Enviar</button>
      </form>
    </div>
  )
}