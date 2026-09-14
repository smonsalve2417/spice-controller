import { useEffect, useRef, useState } from 'react'
import SpiceApi from './spiceapi.js'

const keyAliases = {
  ArrowUp: 'up', ArrowLeft: 'left', ArrowDown: 'down', ArrowRight: 'right',
  '7': '7', '8': '8', '9': '9', '4': '4', '5': '5', '6': '6',
  '1': '1', '2': '2', '3': '3', '0': '0', '.': 'D',
  ' ': 'card'
}

const buttonIds = ['up', 'down', 'left', 'right', 'p1-start', 'p2-start']
const directionPatterns = {
  up: /(^|[^a-z])(up|uparrow|arrowup)([^a-z]|$)/,
  down: /(^|[^a-z])(down|downarrow|arrowdown)([^a-z]|$)/,
  left: /(^|[^a-z])(left|leftarrow|arrowleft)([^a-z]|$)/,
  right: /(^|[^a-z])(right|rightarrow|arrowright)([^a-z]|$)/,
  'p1-start': /(^|[^a-z])(p1\s+start|p1\s+menu\s+start)([^a-z]|$)/,
  'p2-start': /(^|[^a-z])(p2\s+start|p2\s+menu\s+start)([^a-z]|$)/,
}

function findButtonName(names, buttonId) {
  const preferred = {
    up: 'P1 Menu Up',
    down: 'P1 Menu Down',
    left: 'P1 Menu Left',
    right: 'P1 Menu Right',
    'p1-start': 'P1 Start',
    'p2-start': 'P2 Start',
  }[buttonId]
  return names.find((name) => name === preferred)
    || names.find((name) => directionPatterns[buttonId].test(name.toLowerCase()))
    || null
}

function isEditableTarget(target) {
  return target instanceof HTMLElement
    && (target.matches('input, textarea, select') || target.isContentEditable)
}

function usePressedControls({ host, port, password, card, player }) {
  const apiRef = useRef(null)
  const keypadRef = useRef(new Set())
  const directionNamesRef = useRef(new Map())
  const [pressed, setPressed] = useState(new Set())
  const [connection, setConnection] = useState('idle')
  const [error, setError] = useState('')

  const sendKeypadState = () => {
    apiRef.current?.send('keypads', 'set', [0, ...keypadRef.current])
  }

  const sendDirection = (id, isPressed) => {
    const name = directionNamesRef.current.get(id)
    if (!name) return
    apiRef.current?.send(
      'buttons',
      isPressed ? 'write' : 'write_reset',
      isPressed ? [[name, 1]] : [[name]],
    )
  }

  const sendCard = () => {
    if (!apiRef.current?.connected) {
      setError('Conecta con Spice2x antes de insertar una tarjeta.')
      return
    }

    const cardId = String(card || '').trim().toUpperCase()
    const playerIndex = Number(player)

    if (!/^[0-9A-F]{16}$/.test(cardId)) {
      setError('La tarjeta debe tener exactamente 16 caracteres hexadecimales.')
      return
    }
    if (playerIndex !== 0 && playerIndex !== 1) {
      setError('El jugador debe ser 0 (P1) o 1 (P2).')
      return
    }

    apiRef.current.request('card', 'insert', [playerIndex, cardId])
      .then(() => setError(''))
      .catch((requestError) => setError(requestError.message))
  }

  const press = (id) => {
    setPressed((current) => new Set(current).add(id))
    if (id === 'card') {
      sendCard()
      return
    }
    if (buttonIds.includes(id)) {
      sendDirection(id, true)
      return
    }
    keypadRef.current.add(id)
    sendKeypadState()
  }

  const release = (id) => {
    setPressed((current) => {
      const next = new Set(current)
      next.delete(id)
      return next
    })
    if (buttonIds.includes(id)) {
      sendDirection(id, false)
      return
    }
    if (id === 'card') return
    keypadRef.current.delete(id)
    sendKeypadState()
  }

  const releaseAll = () => {
    directionNamesRef.current.forEach((name) => {
      if (name) apiRef.current?.send('buttons', 'write_reset', [[name]])
    })
    keypadRef.current.clear()
    sendKeypadState()
    setPressed(new Set())
  }

  const connect = () => {
    apiRef.current?.close()
    const resolvedHost = host.trim() || window.location.hostname || '127.0.0.1'
    const api = new SpiceApi(resolvedHost, Number(port) || 1337, password)
    apiRef.current = api
    api.onstate = (state) => {
      setConnection(state)
      if (state === 'open') {
        api.request('buttons', 'read').then((data) => {
          const names = data.map((entry) => Array.isArray(entry) ? entry[0] : null)
            .filter((name) => typeof name === 'string')
          directionNamesRef.current = new Map(
            buttonIds.map((buttonId) => [buttonId, findButtonName(names, buttonId)]),
          )
        }).catch((requestError) => setError(requestError.message))
      }
    }
    api.onerror = (message) => setError(message)
    setError('')
    api.connect()
  }

  const disconnect = () => {
    releaseAll()
    apiRef.current?.close()
    apiRef.current = null
    directionNamesRef.current.clear()
    setConnection('idle')
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isEditableTarget(event.target)) return
      const id = keyAliases[event.key]
      if (!id || event.repeat) return
      event.preventDefault()
      press(id)
    }
    const handleKeyUp = (event) => {
      if (isEditableTarget(event.target)) return
      const id = keyAliases[event.key]
      if (id) release(id)
    }
    const clearPressed = () => releaseAll()

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', clearPressed)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', clearPressed)
      apiRef.current?.close()
    }
  }, [])

  return { pressed, press, release, connect, disconnect, connection, error }
}

export default usePressedControls
