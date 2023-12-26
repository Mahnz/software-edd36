// ElencoVisite.js
import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios"
import Cookies from "universal-cookie"
import {Button, Container, Grid, Paper, Typography} from "@mui/material"

export default function ElencoVisite({setVisita,codiceUtente}) {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [visite, setVisite] = useState([])

    useEffect(() => {
        const fetchVisiteMediche = async () => {
            try {
                let CF;
                // TODO - Da rimuovere quando il codice fiscale viene letto dal cookie
                if(cookies.get("token"))
                {
                    CF= cookies.get('token');
                    await axios.get(`http://localhost:3001/api/bc/getCF/${CF}`)
                        .then(res=>{console.log(res); CF=res.data}).catch(e=>console.log(e));
                    await axios.get(`http://localhost:3001/api/ipfs/getAllVisiteByCF/${CF}`)
                        .then(res=> setVisite(res.data.visite)).catch(e=>console.log(e));
                }


            } catch (error) {
                console.error("Errore durante il recupero delle visite mediche:", error)
            }
        }

        fetchVisiteMediche()
    }, []) // Avviato solo al primo rendering della pagina

    const handleOpen = (visit) => {
        setVisita(visit)
        console.log(visit)
        navigate('/dashboard/visite/visualizzaVisita')
    }

    return (
        <>
            <Typography variant="h4" mb={4}>
                Le tue ultime visite mediche
            </Typography>
            <Grid container spacing={5}>
                {visite.map((visit, index) => (
                    <Grid item xs={12} md={8} lg={6} key={index}>
                        <Paper
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 220,
                                transition: 'box-shadow 0.2s',
                                '&:hover': {
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                                },
                            }}>
                            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                                <div style={{flexGrow: 1}}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        <b>{visit.nomeVisita}</b>
                                    </Typography>
                                    <Typography color="text.secondary" gutterBottom>
                                        <b>Data:</b> {visit.dataVisita}
                                    </Typography>
                                    <Typography color="text.secondary" gutterBottom>
                                        <b>Medico:</b> {visit.medico}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{flex: 1}}>
                                        <b>Ultimo aggiornamento:</b> 13:50, 11/12/2021
                                    </Typography>
                                </div>
                                <Container sx={{textAlign: 'center', pb: 1}}>
                                    <Button variant="contained" color="primary" onClick={() => handleOpen(visit)}>
                                        VISUALIZZA DETTAGLI
                                    </Button>
                                </Container>
                            </div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}