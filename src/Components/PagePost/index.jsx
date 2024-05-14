import { useContext, useEffect, useState } from "react";
import { GalleryImages } from "../GalleryImages";
import "./styles.css";
import { Link, useParams } from "react-router-dom";
import { IoMdPin } from "react-icons/io";
import { GoHomeFill } from "react-icons/go";
import { FaChartArea, FaCheck } from "react-icons/fa";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { FaCircleInfo } from "react-icons/fa6";
import { UserContext } from "../../UserContext";

export const PostPage = () => {
  const [modalPrice, setModalPrice] = useState(false);
  const { id } = useParams();
  const [openedGalery, setOpenedGalery] = useState(false);
  const [data, setData] = useState([]);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDZfZuGX7IFFKJ2nfiOI-0sI9B0I5jHvHM",
  });
  const { login } = useContext(UserContext);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://huergo.com.br/lot-api/json/api/photo/${id}`
      );
      if (response.ok) {
        const json = await response.json();
        setData(json.photo);
      } else {
        console.error("Erro ao carregar os dados:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao processar a solicitação:", error);
    }
  };

  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (
      isLoaded &&
      !googleMapsLoaded &&
      data.localidade &&
      data.cidade &&
      data.bairro
    ) {
      setGoogleMapsLoaded(true);
      const geocoder = new window.google.maps.Geocoder();
      const address = `${data.localidade}, ${data.cidade}, ${data.bairro}`;
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results.length > 0) {
          setLocation({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        } else {
          console.error("Erro ao geocodificar endereço:", status);
        }
      });
    }
  }, [isLoaded, data, googleMapsLoaded]);

  useEffect(() => {
    fetchData();
  }, []);

  const feat = data && data.features;
  const feature = feat ? feat.split(",").map((item) => item.trim()) : [];

  return (
    <div
      className={`post-page__container container ${
        openedGalery ? "gallery-open" : ""
      }`}
      style={{
        position: "relative",
      }}
    >
      {data && (
        <div className="post-page__container container">
          <div className="post-page__content">
            <div className="img-post__page">
              <div className="img-1">
                <img
                  src={
                    data.imagens_relacionadas &&
                    data.imagens_relacionadas[
                      data.imagens_relacionadas.length - 1
                    ]
                  }
                />
              </div>
              <div className="img-2">
                <img
                  src={
                    data.imagens_relacionadas &&
                    data.imagens_relacionadas[
                      data.imagens_relacionadas.length - 2
                    ]
                  }
                />
              </div>
              <button
                id="button-galery"
                onClick={() => {
                  setOpenedGalery(!openedGalery);
                }}
              >
                Ver galeria
              </button>
            </div>

            <div className="info-post__page">
              <div className="content-post__page">
                {login && (
                  <Link to={`/accountuser/edit-post/${data.id}`}>
                    <button id="button-edit">Editar post</button>
                  </Link>
                )}

                <p>
                  <IoMdPin />
                  {data.localidade}
                </p>
                <h1 id="title">{data.title}</h1>
                {data.breve_descricao && (
                  <p
                    id="description"
                    dangerouslySetInnerHTML={{
                      __html: data.breve_descricao.replace(/\n/g, "<br>"),
                    }}
                  ></p>
                )}
                <button id="button-price">
                  <a
                    href={`https://wa.me//+554391107942?text=Tenho%20interesse%20em%20comprar%20este%20imovel:%20${window.location.href}`}
                  >
                    Mais informações
                  </a>
                </button>
                <hr></hr>
                <h1 id="about">Caracteristicas</h1>
                <div className="features">
                  <div className="box">
                    <GoHomeFill />
                    <h1>{data.qtd_salas}</h1>
                    <p>salas</p>
                  </div>
                  <div className="box">
                    <GoHomeFill />
                    <h1>{data.qtd_banheiros && data.qtd_banheiros}</h1>
                    <p>banheiros</p>
                  </div>
                  <div className="box">
                    <GoHomeFill />
                    <h1>{data.qtd_quartos && data.qtd_quartos}</h1>
                    <p>quartos</p>
                  </div>
                  <div className="box">
                    <GoHomeFill />
                    <h1>{data.qtd_vagas && data.qtd_vagas}</h1>
                    <p>vagas</p>
                  </div>
                  <div className="box">
                    <FaChartArea />
                    <h1>{data.metros_privativos && data.metros_privativos}</h1>
                    <p>privativos</p>
                  </div>
                  <div className="box">
                    <FaChartArea />
                    <h1>{data.metros_totais && data.metros_totais}</h1>
                    <p>totais</p>
                    {console.log(data)}
                  </div>
                </div>
                <hr></hr>
                <div className="feat">
                  {feature.map((item) => {
                    return (
                      <ul>
                        <li>
                          <FaCheck />
                          {item}
                        </li>
                      </ul>
                    );
                  })}
                </div>
                <hr></hr>
                <div>
                  <h1 id="full-description">Descrição completa</h1>
                  {data.descricao_completa && (
                    <p
                      id="content_desc"
                      dangerouslySetInnerHTML={{
                        __html: data.descricao_completa.replace(/\n/g, "<br>"),
                      }}
                    ></p>
                  )}
                </div>

                <hr></hr>
                {console.log(data)}

                <div className="right-side__map">
                  <h1 id="map-endereco">Endereço</h1>
                  <p id="map-desc">{data.localidade}</p>
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={location}
                      zoom={15}
                    >
                      <Marker position={location} />
                    </GoogleMap>
                  ) : (
                    <></>
                  )}
                </div>

                {openedGalery && (
                  <div
                    className="gallery"
                    style={{
                      position: "absolute",
                      left: "0",
                      right: "0",
                      top: "0",
                      botttom: "0",
                      background: "white",
                      margin: "0",
                      padding: "0",
                    }}
                  >
                    <button
                      id="button-galery"
                      onClick={() => {
                        setOpenedGalery(!openedGalery);
                      }}
                    >
                      Fechar galeria
                    </button>
                    <GalleryImages images={data.imagens_relacionadas} />
                  </div>
                )}
              </div>
              {data.locacao_ou_venda == "Locacao" && (
                <div id="value-add" style={{ zIndex: "-999999" }}>
                  <FaCircleInfo
                    onMouseEnter={() => setModalPrice(true)}
                    onMouseLeave={() => setModalPrice(false)}
                  />
                  <div id={`${modalPrice ? "active" : ""}`}>
                    <p>{data.informacao_adicional_titulo}</p>
                    <p>
                      O valor bruto é de{" "}
                      <h1>
                        R${" "}
                        {Number((data.preco * 125) / 100).toLocaleString(
                          "pt-br",
                          {
                            type: "currency",
                            currency: "BRL",
                          }
                        )}
                      </h1>{" "}
                      mas oferecemos uma bonificação de sempre que a cobrança é
                      quitada até o vencimento, com este beneficio exclusico o
                      aluguel sai por{" "}
                      <h1>
                        R${" "}
                        {Number(data.preco).toLocaleString("pt-br", {
                          type: "currency",
                          currency: "BRL",
                        })}
                      </h1>
                    </p>
                  </div>
                </div>
              )}

              <div className="price-post__page">
                <p id="price-total">Valor</p>
                <h1>
                  R${" "}
                  {Number(data.preco).toLocaleString("pt-br", {
                    type: "currency",
                    currency: "BRL",
                  })}
                </h1>
                {data.texto_adicional && (
                  <p
                    id="value"
                    dangerouslySetInnerHTML={{
                      __html: data.texto_adicional.replace(/\n/g, "<br>"),
                    }}
                  ></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
