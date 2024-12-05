import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, Filter } from "./styles"
import { FaArrowLeft } from 'react-icons/fa'
import api from "../../services/api"

export default function Repository() {
    const { repository } = useParams();
    const [repositoryData, setRepositoryData] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        {state: 'all', label: 'all', active: true},
        {state: 'open', label: 'open', active: false},
        {state: 'closed', label: 'closed', active: false},
    ]);
    const [filterIndex, setFilterIndex] = useState(0);

    useEffect(() => {
        async function load() {

            const [repositoryData, issuesData] = await Promise.all([
                api.get(`repos/${repository}`),
                api.get(`repos/${repository}/issues`, {
                    params:{
                        state: filters.find(filter => filter.active).state,
                        per_page: 5
                    }
                }),
            ]);

            setRepositoryData(repositoryData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        load();
    }, [repository, filters]);

    useEffect(() => {
        async function loadIssues() {
            const response = await api.get(`repos/${repository}/issues` , {
                params:{
                    state: filters[filterIndex].state,
                    per_page: 5,
                    page,
                }
            })
            
            setIssues(response.data)
        }

        loadIssues();
    }, [page, repository, filters, filterIndex]);

    function handlePage(next){
        setPage(next ? page + 1 : page - 1)
    }

    function handleFilter(index){
        setFilterIndex(index)
    }

    if (loading) {
        return (
            <Loading>Loading . . .</Loading>
        )
    }

    return (
        <div>
            <Container>
                <BackButton to="/">
                    <FaArrowLeft color="#000" size={30}/>
                </BackButton>

                <Owner>
                    <img 
                        src={repositoryData.owner.avatar_url} 
                        alt={repositoryData.owner.login} 
                    />
                    <h1>{repositoryData.name}</h1>
                    <p>{repositoryData.description}</p>
                </Owner>

                <Filter active={filterIndex}>
                    {filters.map((filter, index) => (
                        <button
                            type="button"
                            key={filter.label}
                            onClick={() => handleFilter(index)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </Filter>

                <IssuesList>
                    {issues.map(issue => (
                        <li key={issue.id}>
                            <img src={issue.user.avatar_url} alt={issue.user.login} />

                            <div>
                                <strong>
                                    <a href={issue.html_url}>{issue.title}</a>

                                    {issue.labels.map(label => (
                                        <span key={label.id}>
                                            {label.name}
                                        </span>
                                    ))}

                                </strong>

                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssuesList>

                <PageActions>
                    <button 
                        type="button" 
                        onClick={() => handlePage(false)}
                    >
                        Back
                    </button>

                    <button 
                        type="button" 
                        onClick={() => handlePage(true)}
                        disabled={page < 2}
                    >
                        Next
                    </button>
                </PageActions>

            </Container>
        </div>
    )
}