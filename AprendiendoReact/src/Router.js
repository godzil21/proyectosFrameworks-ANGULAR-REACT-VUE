import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//Importar componentes
import Peliculas from "./components/Peliculas";
import MiComponente from "./components/MiComponente";
import Error from "./components/Error";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Blog from "./components/Blog";
import Formulario from "./components/Formulario";

class Router extends Component {
    render() {
        return (
            <BrowserRouter>

                <Header />


                {/* CONFIGURAR RUTAS Y PÁGINAS */}
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/blog" component={Blog} />
                    <Route exact path="/formulario" component={Formulario} />
                    <Route exact path="/peliculas" component={Peliculas} />

                    <Route
                        exact
                        path="/pagina-1"
                        render={() => (
                            <React.Fragment>
                                <h1>Hola mundo desde la ruta: PAGINA 1</h1>
                                <MiComponente saludo="Hola amigo" />
                            </React.Fragment>
                        )}
                    />

                    <Route
                        exact
                        path="/pruebas/:nombre/:apellidos?"
                        render={(props) => {
                            var nombre = props.match.params.nombre;
                            var apellidos = props.match.params.apellidos;

                            return (
                                <div id="content">
                                    <h1 className="subheader">Página de pruebas</h1>
                                    <h2>{nombre}</h2>
                                </div>
                            );
                        }}
                    />

                    <Route component={Error} />
                </Switch>



                <div className="clearfix"></div>

                <Footer />
            </BrowserRouter>
        );
    }
}

export default Router;
