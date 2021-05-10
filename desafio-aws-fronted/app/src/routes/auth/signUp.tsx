import React, { useState, useContext } from 'react'

import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import { useValidEmail, useValidPassword, useValidUsername } from '../../hooks/useAuthHooks'
import { Email, Password, Username } from '../../components/authComponents'

import { AuthContext } from '../../contexts/authContext'

const useStyles = makeStyles({
  root: {
    height: '100vh',
  },
})

const SignUp: React.FunctionComponent<{}> = () => {
  const classes = useStyles()

  const { email, setEmail, emailIsValid } = useValidEmail('')
  const { password, setPassword, passwordIsValid } = useValidPassword('')
  const { username, setUsername, usernameIsValid } = useValidUsername('')
  const [error, setError] = useState('')
  const [created, setCreated] = useState(false)

  const {
    password: passwordConfirm,
    setPassword: setPasswordConfirm,
    passwordIsValid: passwordConfirmIsValid,
  } = useValidPassword('')

  const isValid =
    !emailIsValid ||
    email.length === 0 ||
    !usernameIsValid ||
    username.length === 0 ||
    !passwordIsValid ||
    password.length === 0 ||
    !passwordConfirmIsValid ||
    passwordConfirm.length === 0 ||
    password !== passwordConfirm

  const history = useHistory()

  const authContext = useContext(AuthContext)

  const signInClicked = async () => {
    try {
      await authContext.signUpWithEmail(username, email, password)
      setCreated(true)
    } catch (err) {
      setError(err.message)
    }
  }

  const signUp = (
    <>
      <Box width="80%" m={1}>
        <Email emailIsValid={emailIsValid} setEmail={setEmail} />
      </Box>
      <Box width="80%" m={1}>
        <Username usernameIsValid={usernameIsValid} setUsername={setUsername} />
      </Box>
      <Box width="80%" m={1}>
        <Password label="Digete uma Senha" passwordIsValid={passwordIsValid} setPassword={setPassword} />
      </Box>
      <Box width="80%" m={1}>
        <Password label="Redigite a Senha" passwordIsValid={passwordConfirmIsValid} setPassword={setPasswordConfirm} />
      </Box>
      <Box mt={2}>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Box>

      {/* Buttons */}
      <Box mt={2}>
        <Grid container direction="row" justify="center">
          <Box m={1}>
            <Button onClick={() => history.goBack()} color="secondary" variant="contained">
              Cancelar
            </Button>
          </Box>
          <Box m={1}>
            <Button disabled={isValid} color="primary" variant="contained" onClick={signInClicked}>
              Entrar
            </Button>
          </Box>
        </Grid>
      </Box>
    </>
  )

  const accountCreated = (
    <>
      <Typography variant="h5">{`Criado conta ${username}`}</Typography>
      <Typography variant="h6">{`Foi envidado código de validação para o e-mail ${email}`}</Typography>

      <Box m={4}>
        <Button onClick={() => history.push('/verify')} color="primary" variant="contained">
          Send Code
        </Button>
      </Box>
    </>
  )

  return (
    <Grid className={classes.root} container direction="row" justify="center" alignItems="center">
      <Grid xs={11} sm={6} lg={4} container direction="row" justify="center" alignItems="center" item>
        <Paper style={{ width: '100%', padding: 16 }}>
          <Grid container direction="column" justify="center" alignItems="center">
            {/* Title */}
            <Box m={3}>
              <Grid container direction="row" justify="center" alignItems="center">
                <Typography variant="h3">Sign Up</Typography>
              </Grid>
            </Box>

            {!created ? signUp : accountCreated}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default SignUp
