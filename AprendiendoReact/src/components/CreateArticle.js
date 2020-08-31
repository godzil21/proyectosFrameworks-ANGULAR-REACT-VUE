import React, { Link, Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import SimpleReactValidator from "simple-react-validator";
import swall from 'sweetalert';
import Global from "../Global";
import Sidebar from "./Sidebar";

//Validación formularios y alertas

class CreateArticle extends Component {
  titleRef = React.createRef();
  contentRef = React.createRef();
  url = Global.url;

  state = {
    article: {},
    status: null,
    selectedFile: null,
  };

  componentWillMount() {
    this.validator = new SimpleReactValidator({
        messages: {
            required: 'Este campo es requerido!'
        }
    });
  }

  changeState = () => {
    this.setState({
      article: {
        title: this.titleRef.current.value,
        content: this.contentRef.current.value,
      },
    });

    this.validator.showMessages();
    this.forceUpdate();
  };

  saveArticle = (e) => {
    e.preventDefault();

    //Rellenar state con formulario
    this.changeState();

    if (this.validator.allValid()) {
      //Hacer una petición http por post para guardar el artículo
      axios.post(this.url + "save", this.state.article).then((res) => {
        if (res.data.article) {
          this.setState({
            article: res.data.article,
            status: "waiting",
          });

          swall(
            'Artículo creado',
            'El artículo ha sido creado correctamente',
            'success'
          );

          //Subir la imagen
          if (this.state.selectedFile !== null) {
            //Sacar el id del artículo guardado
            var articleId = this.state.article._id;

            //Crear form data y añadir fichero
            const formData = new FormData();
            formData.append(
              "file0",
              this.state.selectedFile,
              this.state.selectedFile.name
            );

            //Petición Ajax
            axios
              .post(this.url + "upload-image/" + articleId, formData)
              .then((res) => {
                if (res.data.article) {
                  this.setState({
                    article: res.data.article,
                    status: "success",
                  });
                } else {
                  this.setState({
                    article: res.data.article,
                    status: "failed",
                  });
                }
              });
          } else {
            this.setState({
              status: "success",
            });
          }
        } else {
          this.setState({
            status: "failed",
          });
        }
      });
    } else {
      this.setState({
        status: "failed",
      });

      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  fileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  render() {
    if (this.state.status === "success") {
      return <Redirect to="/blog" />;
    }

    return (
      <div className="center">
        <section id="content">
          <h1 className="subheader">Crear artículo</h1>

          <form className="mid-form" onSubmit={this.saveArticle}>
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                name="title"
                ref={this.titleRef}
                onChange={this.changeState}
              ></input>

              {this.validator.message(
                "title",
                this.state.article.title,
                "required|alpha_num_space"
              )}
            </div>

            <div className="form-group">
              <label htmlFor="content">Contenido</label>
              <textarea
                name="content"
                ref={this.contentRef}
                onChange={this.changeState}
              ></textarea>

              {this.validator.message(
                "content",
                this.state.article.content,
                "required"
              )}
            </div>

            <div className="form-group">
              <label htmlFor="file0">Imagen</label>
              <input
                type="file"
                name="file0"
                onChange={this.fileChange}
              ></input>
            </div>

            <input type="submit" value="guardar" className="btn btn-success" />
          </form>
        </section>

        <Sidebar />
      </div>
    );
  }
}

export default CreateArticle;
