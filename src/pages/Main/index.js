import React, { useState, useCallback, useEffect } from "react"
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import {Container, Form, SubmitButton, List, DeleteButton} from './styles'
import { Link } from "react-router-dom"
import api from '../../services/api'

const REPOSITORIES_KEY = "repositories";

export default function Main() {
    const [newRepository, setNewRepository] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const repositoriesLocalStorage = localStorage.getItem(REPOSITORIES_KEY);
        
        if (repositoriesLocalStorage) {
            setRepositories(JSON.parse(repositoriesLocalStorage))
        }
    }, [])

    useEffect(() => {
        if (repositories.length > 0) {
            localStorage.setItem(REPOSITORIES_KEY, JSON.stringify(repositories));
        }
    }, [repositories])

    const handleSubmit = useCallback( async (e) =>{
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        // async function submit(){
            
        try {
            if (!newRepository.trim()) {
                throw new Error('Repository name is required.');
            }

            if (repositories.some(repository => repository.name === newRepository)) {
                throw new Error('Repository already exists.');
            }

            const response = await api.get(`repos/${newRepository}`)
            const data = {
                name: response.data.full_name
            }

            // setRepositories([...repositories, data]);
            setRepositories((prevRepos) => [...prevRepos, data]);
            setNewRepository('');
        } catch(error) {
            console.log(error)
            setAlert(error)
        } finally {
            setLoading(false)
        }
            
    }, [newRepository, repositories]);

    const handleInputChange = (e) => {
        setAlert(null)
        setNewRepository(e.target.value)
    }

    const handleDelete = useCallback((name) => {
        const updatedRepositories = repositories.filter(
            (repo) => repo.name !== name
          );
        setRepositories(updatedRepositories);

        if (updatedRepositories.length === 0) {
            localStorage.removeItem(REPOSITORIES_KEY);
        }
    }, [repositories])
    
    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                My Repositories
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input 
                    type="text"
                    placeholder="Add repositories" 
                    value={newRepository}
                    onChange={handleInputChange}
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus color="#FFF" size={14} />
                    )}
                    
                </SubmitButton>
            </Form>

            <List>
                {repositories.map(repository => (
                    <li key={repository.name}>
                        <span>
                            <DeleteButton onClick={()=> handleDelete(repository.name)}>
                                <FaTrash size={14}/>
                            </DeleteButton>
                            {repository.name}
                        </span>
                        <Link to={`/repository/${encodeURIComponent(repository.name)}`} >
                            <FaBars size={20}/>
                        </Link>
                    </li>
                ))}
            </List>

        </Container>
    )
}