var root = ReactDOM.createRoot(document.getElementById("root"));

// function component + hooks
// class component (state + lifecycle)

class ToDoApp extends React.Component {
  constructor(props) {
    super(props);
    this.clearItems = this.clearItems.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.state = {
      gorevler: [],
    };
  }

  clearItems() {
    this.setState({
      gorevler: [],
    });
  }

  addItem(item) {
    if (this.state.gorevler.indexOf(item) > -1) {
      return "You Can't Add Same Item";
    }
    this.setState((prevState) => {
      return { gorevler: prevState.gorevler.concat(item) };
    });
  }

  deleteItem(item) {
    this.setState((prevState) => {
      const arr = prevState.gorevler.filter((i) => {
        return item != i;
      });
      return {
        gorevler: arr,
      };
    });
  }

  render() {
    const data = {
      baslik: "ToDo Application",
      aciklama: "Bekleyen Gorevler",
    };
    return (
      <div className="container my-5">
        <div className="card">
          <div className="card-header">
            <Header title={data.baslik} description={data.aciklama} />
          </div>
          <div className="card-body">
            <ToDoList
              items={this.state.gorevler}
              clear={this.clearItems}
              deleteItem={this.deleteItem}
            />
          </div>
          <div className="card-footer">
            <NewItem addItem={this.addItem} />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const json_obj = localStorage.getItem("items");
    const items = JSON.parse(json_obj);

    if (items) {
      this.setState({
        gorevler: items,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.gorevler.lenght !== this.state.gorevler.length) {
      const json_string = JSON.stringify(this.state.gorevler);
      localStorage.setItem("items", json_string);
    }
  }
}

const Header = (props) => {
  return (
    <div>
      <h1 className="lead fs-1 text-center">{props.title}</h1>
    </div>
  );
};

const ToDoList = (props) => {
  return (
    <div>
      <ul className="list-group">
        {props.items.map((gorev, index) => (
          <ToDoItem key={index} item={gorev} deleteItem={props.deleteItem} />
        ))}
      </ul>
      {
        props.items.length > 0 ?  
        <p>
        <button
          className="btn btn-outline-danger float-end mt-3"
          onClick={props.clear}
        >
          Temizle
        </button>
        </p>
        :
        <div className="alert alert-warning text-center">
            Please Add An Item
        </div>
      }
     
    </div>
  );
};

const ToDoItem = (props) => {
  return (
    <li className="list-group-item">
      {props.item}{" "}
      <button
        className="btn btn-danger btn-sm float-end"
        onClick={() => {
          props.deleteItem(props.item);
        }}
      >
        X
      </button>
    </li>
  );
};

class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      error: "",
    };
  }
  onFormSubmit(e) {
    e.preventDefault();

    const item = e.target.elements.txtItem.value.trim();

    if (item) {
      e.target.elements.txtItem.value = "";
      const error = this.props.addItem(item);
      this.setState({
        error: error,
      });
    }
  }
  render() {
    return (
      <div>
        {this.state.error && <p className="alert alert-danger text-center">{this.state.error}</p>}
        <form onSubmit={this.onFormSubmit}>
          <div className="input-group">
            <input className="form-control" type="text" name="txtItem" />
            <button className="btn btn-primary" type="submit">Ekle</button>
          </div>
        </form>
      </div>
    );
  }
}

root.render(<ToDoApp />);
