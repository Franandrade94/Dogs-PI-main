import "./home.css";
import "./searchbar.css"
import "./pagination.css"
import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../Redux/actions/index"
import DogCard from "../6-DogCard/DogCard";
import NotFound from "../../Images/notfound.png"

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchbarValue: "",
            offset: 0
        }
        this.updateSearchbarValue = this.updateSearchbarValue.bind(this)
        this.handleSearchbar = this.handleSearchbar.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.soloLocalDb = this.soloLocalDb.bind(this)
    }

    componentDidMount() {
        const search = this.props.location.search;
        let f = new URLSearchParams(search).get('filter');
        const filter = (f != undefined) ? f : this.state.filter
        this.setState({
            ...this.state,
            filter: filter
        })

        this.props.getAllDogs(0, (filter != undefined) ? filter : 'az')
        this.props.searchAllDogs()
    }

    updateSearchbarValue(evt) {
        let value = evt.target?.value;
        this.setState({
            ...this.state,
            searchbarValue: value,
            offset: 0,
            filter: 'az'
        });
    }

    handleSearchbar(e) {
        e.preventDefault();
        const { searchbarValue } = this.state
        this.props.history.push({
            pathname: "/home",
            search: "?" + new URLSearchParams({ search: searchbarValue }).toString()
        })
        this.props.searchAllDogs(searchbarValue)
    }

    previousPage() {
        let offset = this.state.offset - 1
        if (offset < 0) {
            offset = 0
        }
        this.setState({
            ...this.state,
            offset: offset
        });
        this.props.getAllDogs(offset, this.state.filter)
    }

    nextPage() {

        let offset = this.state.offset + 1

        if (this.props.metadata?.len != undefined && this.props.metadata?.len / 8 < offset) {
            return;
        } else {
            this.setState({
                ...this.state,
                offset: offset
            });
            this.props.getAllDogs(offset, this.state.filter)
        }
    }

    soloLocalDb() {
        this.props.getAllDogs(null, this.props.metadata?.offset, true)
    }
    
    
    render() {
        let dogs = []
        dogs = this.props.dogs

        console.log(this.props)

        return (
            <div className="backHome">
                <div className="home">
                    <form className="SearchBar" onSubmit={(e) => this.handleSearchbar(e)}>
                        <input className="SearchText" type="text" placeholder="Search Dog..." value={this.state.searchbarValue} onChange={(evt) => this.updateSearchbarValue(evt)} />
                        <div>
                            <input className="Search-Icon" type="submit" value="Search" />
                        </div>
                    </form>
                    {(this.props.dogs.length === 0) ? <img className="notfoundImg" src={NotFound} alt=""/> : this.props.dogs?.map((dog) => {
                        return <div className="dogcard" key={dog.id}>
                            <DogCard
                                id={dog.id}
                                name={dog.name}
                                image={dog.image?.url}
                                temperament={dog.temperament}
                                weight={dog.weight.metric}
                            />
                        </div>
                    })}
                </div>
                <div className="PaginationDiv">
                        <button className="prev" onClick={() => this.previousPage()}>Prev</button>
                        <button className="next" onClick={() => this.nextPage()}>Next</button>
                </div>
            </div>
        )
    }
};

export const mapStateToProps = (state) => {
    return {
        dogs: state.dogs,
        metadata: state.metadata,
        dogDetail: state.dogDetail
    }
};

export const mapDispatchToProps = (dispatch) => {
    return {
        getAllDogs: (v, f) => dispatch(actions.getAllDogs(v, f)),
        searchAllDogs: (v) => dispatch(actions.searchAllDogs(v)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);