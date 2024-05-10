import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { Post } from "../RowPosts/Post";
import "./styles.css";

export const InactiveProperties = () => {
  const { posts } = useContext(UserContext);
  const [data, setData] = useState();

  const filteredInactivesProperties = () => {
    console.log(posts);
    if (posts) {
      const filteredProperties = posts.filter(
        (item) => item.status === "Inativo"
      );
      setData(filteredProperties);
    }
  };

  useEffect(() => {
    filteredInactivesProperties();
  }, [posts]);

  return (
    <div>
      <div className="inactiveproperties-container">
        <div className="topinfo-container">
          <h1>Imóveis inativos</h1>
          {data && !data.length && <p>Ainda não tem nenhum imóvel inativo.</p>}
        </div>
        <div className="posts-content__inactive">
          {data &&
            data.map((post, index) => (
              <Post
                title={post.title}
                price={post.preco}
                locale={post.localidade}
                qt_bath={post.qtd_banheiros}
                qt_room={post.qtd_quartos}
                size={post.metros_totais}
                img={post.imagens_relacionadas[1]}
                id={post.id}
                status={post.status}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
