import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import { getCloseDate } from "../utils/timeCalculate";
import { getAllPolls } from "../services/pollService";
import auth from "../services/authService";
import VotedButton from "./common/votedButton";

class AllPolls extends Component {
  state = {
    polls: [],
    searchQuery: "",
    pageSize: 5,
    currentPage: 1
  };

  async componentDidMount() {
    const userId = auth.getCurrentUserId();
    let response = null;
    if (!userId) response = await getAllPolls("visitor");
    else response = await getAllPolls(userId);
    this.setState({ polls: response.data });
  }

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
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

  getPollCloseDate = date => {
    const closeDate = getCloseDate(date);
    if (closeDate === "Closed") return "Closed";
    return `Close: ${closeDate}`;
  };

  renderVoteLink = poll => {
    const closeDate = getCloseDate(poll.closedate);
    if (closeDate === "Closed") return;
    if (poll.hasOwnProperty("has_voted") && poll["has_voted"] === true)
      return <VotedButton />;
    return (
      <Link
        className="btn btn-outline-danger float-right"
        style={{ marginRight: 20 }}
        to={`/vote/${poll.id}`}
      >
        Take votes
      </Link>
    );
  };

  render() {
    const { currentPage, pageSize, polls } = this.state;
    const { totalCount, currentPagePolls } = this.getPageData();

    return (
      <div>
        <div className="row" style={{ marginTop: 20 }}>
          <div className="col-8">
            <span className="form-control my-3" style={{ borderWidth: 0 }}>
              Showing {polls.length} polls in total.
            </span>{" "}
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
                      <Link to={`/poll/${poll.id}`} style={{ color: "black" }}>
                        <strong>{poll.title}</strong>
                      </Link>
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
                    <div
                      className="row"
                      style={{ marginLeft: 5, marginTop: 20 }}
                    >
                      {this.getPollCloseDate(poll.closedate)}
                    </div>
                  </div>

                  <div className="col-2 d-flex align-items-center ">
                    {this.renderVoteLink(poll)}
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

export default AllPolls;
