import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  state = { gists: null };

  componentDidMount() {
    fetch("https://api.github.com/gists")
      .then(res => res.json())
      .then(gists => {
        this.setState({ gists });
      });
  }
  render() {
    const { gists } = this.state;
    return (
      <Router>
        <Root>
          <Sidebar>
            {gists ? (
              gists.map(gist => (
                <SidebarItem key={gist.id}>
                  <Link to={`/g/${gist.id}`}>
                    {gist.description || "[No description]"}
                  </Link>
                </SidebarItem>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </Sidebar>
          <Main>
            <Route exact path="/" render={() => <h1>Welcome !</h1>} />
            {gists && (
              <Route
                path="/g/:gistId"
                render={({ match }) => (
                  <Gist gist={gists.find(g => g.id === match.params.gistId)} />
                )}
              />
            )}
          </Main>
        </Root>
      </Router>
    );
  }
}

const Gist = ({ gist }) => {
  return (
    <div>
      <h1>{gist.description || "No description"}</h1>
      <ul>
        {Object.keys(gist.files).map(key => (
          <li key={key}>
            <b>{key}</b>
            <FileContent url={gist.files[key].raw_url} />
          </li>
        ))}
      </ul>
    </div>
  );
};

class FileContent extends Component {
  state = { content: "" };
  componentDidMount() {
    fetch(this.props.url)
      .then(res => res.text())
      .then(content => this.setState({ content }));
  }

  render() {
    return <pre style={{ background: "#EEE" }}>{this.state.content}</pre>;
  }
}

const Root = props => <div style={{ display: "flex" }} {...props} />;

const Sidebar = props => (
  <div
    style={{
      width: "33vw",
      heigth: "100vh",
      background: "#EEE",
      overflow: "auto"
    }}
    {...props}
  />
);

const SidebarItem = props => (
  <div
    style={{
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      padding: "5px 10px"
    }}
    {...props}
  />
);

const Main = props => (
  <div
    style={{
      flex: "1",
      heigth: "100vh",
      overflow: "auto"
    }}
  >
    <div style={{ padding: "20px" }} {...props} />
  </div>
);

export default App;
