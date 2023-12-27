import React, {useEffect, useState} from 'react'
import {
    Paper,
    Typography,
    TextField,
    Button, Card, Grid, Avatar, IconButton, Tooltip, Snackbar, Alert, CircularProgress,
} from '@mui/material'
import {AddCircle, Person} from "@mui/icons-material";
import CodiceFiscale from "codice-fiscale-js";

export default function RichiestaAutorizzazione() {
    const [codiceFiscale, setCodiceFiscale] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [userFound, setUserFound] = useState(null)
    const [error, setError] = useState({
        state: false,
        message: ''
    })

    const handleSearch = async () => {
        if (codiceFiscale === '') {
            setError({
                state: true,
                message: 'Inserisci il codice fiscale'
            })
            setBtnDisabled(true)
            setUserFound(null)
        } else if (codiceFiscale.length < 16 || codiceFiscale.length > 16) {
            setError({
                state: true,
                message: 'Il codice fiscale deve essere di 16 caratteri'
            })
            setBtnDisabled(true)
            setUserFound(null)
        } else {
            setError({
                state: false,
                message: ''
            })

            try {
                // ! Verifica correttezza del codice fiscale
                const test = new CodiceFiscale(codiceFiscale)
                if (test.isValid()) {
                    console.log("Il codice fiscale è valido")
                    setError({
                        state: false,
                        message: ""
                    })

                    // ! Verifica esistenza del codice fiscale in blockchain
                    // BLOCKCHAIN
                    // TODO - Chiamata alla blockchain per leggere il paziente corrispondente al codice fiscale.
                    //        I dati da ottenere sono: Nome, Cognome, Data di nascita, Codice fiscale
                    // const response = await axios.post("http://localhost:3001/api/bc/verify", cf)
                    // if (response.status === 200) {
                    //     console.log("Il codice fiscale è presente sulla blockchain")
                    //     setError({
                    //         state: false,
                    //         message: ""
                    //     })
                    //     setBtnDisabled(false)
                    // } else {
                    //     console.log("Il codice fiscale non è presente sulla blockchain")
                    //     setError({
                    //         state: true,
                    //         message: "Il paziente non è registrato alla piattaforma"
                    //     })
                    //     setBtnDisabled(true)
                    // }

                    setUserFound({
                        firstName: 'Mario',
                        lastName: 'Rossi',
                        birthDate: '01/01/1990',
                        codiceFiscale: 'RSSMRA90M01H501Z',
                    })
                } else {
                    setError({
                        state: true,
                        message: "Il codice fiscale non è valido"
                    })
                    setBtnDisabled(true)
                    setUserFound(null)
                }
            } catch (e) {
                console.log("Il codice fiscale non è valido")
                setError({
                    state: true,
                    message: "Codice fiscale non valido"
                })
                setBtnDisabled(true)
                setUserFound(null)
            }
        }
    }


    const [isFirstRender, setIsFirstRender] = useState(true)
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false)
        } else {
            if (!codiceFiscale) {
                setError({
                    state: true,
                    message: 'Campo obbligatorio'
                })
            } else {
                if (codiceFiscale.length !== 16) {
                    setError({
                        state: true,
                        message: ""
                    })
                } else {
                    setError({
                        state: false,
                        message: ""
                    })
                }
            }
        }

        if (codiceFiscale.length === 16) {
            setBtnDisabled(false)
        } else {
            setBtnDisabled(true)
            setUserFound(null)
            setError({
                state: false,
                message: ""
            })
        }
    }, [codiceFiscale])

    const [showOverlay, setShowOverlay] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const addPaziente = () => {
        console.log('Aggiungi paziente')
        setShowOverlay(true)

        // BLOCKCHAIN
        // TODO - Chiamata alla blockchain per aggiungere il paziente alla lista degli assistiti
        // ........
        setShowOverlay(false)
    }

    return (
        <>
            {showOverlay && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 999, // Assicura che l'overlay sia sopra tutto il resto
                    }}
                >
                    <CircularProgress color="success"/>
                </div>
            )}
            <Typography variant="h4" mb={4}>
                Richiesta autorizzazione di accesso ai dati
            </Typography>
            <Paper sx={{padding: 2, marginTop: 2}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <TextField type="text"
                                   name="codiceFiscale"
                                   label="Codice Fiscale del Paziente"
                                   value={codiceFiscale}
                                   onChange={(e) => setCodiceFiscale(e.target.value.toUpperCase())}
                                   fullWidth
                                   variant="outlined"
                                   required
                                   InputProps={{
                                       minLength: 16,
                                       maxLength: 16
                                   }}
                                   inputProps={{
                                       minLength: 16,
                                       maxLength: 16
                                   }}
                                   error={error.state}
                                   helperText={error.state && error.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="contained"
                            color={btnDisabled ? 'error' : "success"}
                            disabled={btnDisabled}
                            onClick={handleSearch}
                            sx={{
                                '&:disabled': {
                                    backgroundColor: '#6f7174',
                                    borderColor: '#6f7174',
                                    color: '#fff',
                                    boxShadow: 'none',
                                }
                            }}
                            style={{height: "100%"}}
                            fullWidth
                        >
                            Cerca
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {userFound && (
                // <Card sx={{width: '100%', marginTop: 3, borderRadius: 4, pl: 1, pt: 1}}>
                //     <CardContent>
                //         <Typography variant="h5" color="primary">
                //             {userFound.firstName + " " + userFound.lastName}
                //         </Typography>
                //         <Typography variant="h6">
                //             {userFound.birthDate}
                //         </Typography>
                //         <List>
                //             <ListItemAvatar>
                //                 <Avatar sx={{width: 100, height: 100}}>
                //                     <Person sx={{width: 80, height: 80}}/>
                //                 </Avatar>
                //             </ListItemAvatar>
                //             <ListItem>
                //                 <ListItemText primary={`Data di Nascita: ${userFound.birthDate}`}/>
                //             </ListItem>
                //             <ListItem>
                //                 <ListItemText primary={`Codice Fiscale: ${userFound.codiceFiscale}`}/>
                //             </ListItem>
                //         </List>
                //     </CardContent>
                // </Card>
                <Card sx={{width: '50%', marginTop: 3, borderRadius: 4, p: 2}}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar sx={{width: 100, height: 100, bgcolor: '#6797ef'}}>
                                <Person sx={{width: 80, height: 80}}/>
                            </Avatar>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">{`${userFound.firstName} ${userFound.lastName}`}</Typography>
                            <Typography variant="subtitle1">{userFound.birthDate}</Typography>
                            <Typography variant="subtitle1">{userFound.codiceFiscale}</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Aggiungi utente" placement="right">
                                <IconButton onClick={() => addPaziente()}>
                                    <AddCircle color="success" fontSize="large"/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Card>
            )}

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{width: '100%'}}>
                    Visita medica inserita correttamente!
                </Alert>
            </Snackbar>
        </>
    )
}