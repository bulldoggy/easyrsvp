import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Container, Paper, Snackbar, Alert, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, useEffect } from 'react';
import copy from "copy-to-clipboard";
import dayjs from "dayjs";

export default function Home() {
    const paperStyle = {padding:"10px 20px", width: 800, margin:"20px auto"};
    const linkDivStyle = { width: "parent", display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "-15px"};

    const [invite, setInvite] = useState(null);
    const [inviteCode, setInviteCode] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestMobile, setGuestMobile] = useState('');
    const [guestDecision, setGuestDecision] = useState('');
    const [guestNotes, setGuestNotes] = useState('');

    const [nameTouched, setNameTouched] = useState(false);
    const [mobileTouched, setMobileTouched] = useState(false);
    const [decisionTouched, setDecisionTouched] = useState(false);

    const [copySnackbar, setCopySnackbar] = useState(false)
    const [errorSnackbar, setErrorSnackbar] = useState(false)
    const [submitted, setSubmitted] = useState(false);
    
    const [response, setResponse] = useState(null);
    const [guestLink, setGuestLink] = useState('');

    const copyGuestLink = () => {
        setCopySnackbar(true);
        copy(guestLink);
    };

    const submitForm = (e)=>{
        if(guestName === '' || guestMobile === '' || guestDecision === '') {
            setNameTouched(true);
            setMobileTouched(true);
            setDecisionTouched(true);
            setErrorSnackbar(true);
        } else {
            e.preventDefault();
            const responseCreateDTO = {inviteCode, guestName, guestMobile, guestDecision, guestNotes};
            
            fetch("http://localhost:8080/rsvp/createResponse", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(responseCreateDTO)
            })
            .then(res => res.json())
            .then(result => {
                setResponse(result);
                setSubmitted(true);
            })
        }
    }

    useEffect(()=>{
        fetch("http://localhost:8080" + window.location.pathname + window.location.search)
        .then(res => res.json())
        .then(result => {
            setInvite(result);
            setInviteCode(result.inviteCode);
        })
    }, [])

    useEffect(() => {
        if(response != null) {
            setGuestLink(`localhost:3000/rsvp/guest?code=`+response.guestCode);
        }
    }, [response]);

    return (
        <Container style={{paddingTop:"60px"}}>
            <Paper elevation={3} style={paperStyle}>
                <h2> You have been invited! </h2>

                {invite != null && 
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                >

                    <h4 style={{float: "left", marginBottom: "-5px"}}>Host:</h4>
                    <TextField id="outlined-basic" variant="outlined" fullWidth disabled 
                        sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                            },
                        }}
                        value={invite.ownerName}
                    />

                    <h4 style={{float: "left", marginBottom: "-5px"}}>Details:</h4>
                    <TextField id="outlined-basic" variant="outlined" fullWidth disabled 
                        sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                            },
                        }}
                        value={invite.eventDetails}
                    />

                    <h4 style={{float: "left", marginBottom: "-5px"}}>Address:</h4>
                    <TextField id="outlined-basic" variant="outlined" fullWidth disabled 
                        sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                            },
                        }}
                        value={invite.eventAddress}
                    />


                    <div style={{width: "parent", display: "flex", marginBottom: "-25px", marginTop: "-12px"}}> 
                        <h4>Date:</h4>
                    </div>

                    <div style={{width: "parent", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DateTimePicker fullWidth disableOpenPicker
                            sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor: "#000000",
                                },
                            }}
                            value={dayjs(invite.eventDate)}  
                            InputProps={{
                                disabled: true,
                                readOnly: true
                            }}
                            ampm={true}
                            />
                        </LocalizationProvider>
                        <TextField id="outlined-basic" variant="outlined" fullWidth disabled style={{width: "70%", marginRight: "-15px"}}
                            sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor: "#000000",
                                },
                            }}
                            value={invite.timezone}
                        />
                    </div>
                </Box>
                }
            </Paper>

            <Paper elevation={3} style={paperStyle}>
                <h2> RSVP below now! </h2>

                <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1 },
                }}
                autoComplete="off"
                >
                <TextField id="outlined-basic" label="Guest Name" fullWidth required 
                    value={guestName}
                    onChange={(e)=> {
                        setGuestName(e.target.value) 
                        setNameTouched(true);
                    }}
                    error={nameTouched && guestName.length === 0}
                    InputProps={{
                        readOnly: submitted
                    }}
                />
                <TextField id="outlined-basic" label="Mobile Number" fullWidth required 
                    value={guestMobile}
                    onChange={(e)=> {
                        setGuestMobile(e.target.value) 
                        setMobileTouched(true);
                    }}
                    error={mobileTouched && guestMobile.length === 0}
                    InputProps={{
                        readOnly: submitted
                    }}
                />

                <FormControl>
                    <FormLabel id="radio-buttons-group-label">Attendance *</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={(e)=> {
                            setGuestDecision(e.target.value) 
                            setDecisionTouched(true);
                        }}
                        error={decisionTouched && guestDecision.length === 0}
                    >
                        <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                        <FormControlLabel value="NO" control={<Radio />} label="No" />
                        <FormControlLabel value="UNSURE" control={<Radio />} label="Unsure" />
                    </RadioGroup>
                </FormControl>

                <TextField id="outlined-multiline-static" label="Additional Notes" multiline fullWidth rows={3}
                value={guestNotes}
                onChange={(e)=> {
                    setGuestNotes(e.target.value) 
                }}
                InputProps={{
                    readOnly: submitted
                }}
                />

                {response == null && <Button variant="contained" onClick={submitForm} color="success">Submit</Button>}
                </Box>
            </Paper>

            {response != null && 
            <Paper elevation={3} style={paperStyle}>
                <h2> Save the link below! </h2>

                <h4> Use this personalized link to view and edit your response in future</h4>
                <div style={linkDivStyle}>
                    <TextField id="outlined-basic" fullWidth 
                        value={guestLink}
                        InputProps={{
                            readOnly: true
                        }}
                        style={{marginRight:"20px"}}
                    />
                    <Button onClick={copyGuestLink} variant="contained" size="small">COPY</Button>
                </div>

                <br/>
            </Paper>
            }

            <Snackbar
                open={copySnackbar}
                onClose={() => setCopySnackbar(false)}
                autoHideDuration={2000}
                message="Copied to clipboard"
            />

            <Snackbar
                open={errorSnackbar}
                onClose={() => setErrorSnackbar(false)}
                autoHideDuration={2000}
            >
                <Alert severity="error">Fill in all required fields</Alert>
            </Snackbar>
        </Container>
    );
}
