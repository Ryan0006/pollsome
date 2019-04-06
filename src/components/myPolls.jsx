import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import { getMyPolls } from "../services/pollService";
import auth from "../services/authService";

class MyPolls extends Component {
  state = {
    polls: [],
    searchQuery: "",
    pageSize: 5,
    currentPage: 1
  };

  async componentDidMount() {
    let response = null;
    try {
      response = await getMyPolls();
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
        await auth.refreshToken();
        response = await getMyPolls();
      }
    }
    this.setState({ polls: response.data });
  }

  handleSearch = query => {
    this.setState({ searchQuery: query });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  getPageData = () => {
    const { polls: allPolls, searchQuery, currentPage, pageSize } = this.state;
    let filtered = allPolls;
    if (searchQuery)
      filtered = allPolls.filter(m =>
        m.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    const currentPagePolls = paginate(filtered, currentPage, pageSize);
    return { totalCount: filtered.length, currentPagePolls: currentPagePolls };
  };

  render() {
    const { currentPage, pageSize } = this.state;
    const { totalCount, currentPagePolls } = this.getPageData();

    return (
      <div>
        <div className="row" style={{ marginTop: 20 }}>
          <div className="col-8 d-flex align-items-center">
            <Link className="btn btn-outline-danger" to="/mypolls/new">
              Create New
            </Link>
          </div>
          <div className="col-4">
            <input
              className="form-control my-3 float-right"
              placeholder="Search..."
              onChange={e => this.handleSearch(e.currentTarget.value)}
            />
          </div>
        </div>

        <div className="row">
          {currentPagePolls.length === 0 && "No results"}
          <ul className="list-group col-12">
            {currentPagePolls.map(poll => (
              <li
                key={poll.id}
                style={{ marginBottom: 15 }}
                className="list-group-item list-group-item-action"
              >
                <div className="row">
                  <div className="col-10">
                    <div className="row" style={{ marginLeft: 5 }}>
                      <strong>{poll.title}</strong>
                    </div>
                    <div
                      className="row"
                      style={{ marginLeft: 5, marginBottom: 5 }}
                    >
                      {poll.description}
                    </div>
                    <div className="row" style={{ marginLeft: 5 }}>
                      {poll.entries.map(entry => (
                        <button
                          key={poll.entries.indexOf(entry)}
                          className="btn btn-danger btn-sm"
                          style={{ marginRight: 5, marginTop: 5 }}
                          disabled
                        >
                          {entry.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-2 d-flex align-items-center flex-row-reverse">
                    <Link
                      className="btn btn-danger float-right"
                      to={`/mypolls/${poll.id}`}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                <div />
              </li>
            ))}
          </ul>
        </div>

        <div className="row">
          <div
            className="col-12 d-flex justify-content-center"
            style={{ marginTop: 20 }}
          >
            <Pagination
              itemsCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MyPolls;
