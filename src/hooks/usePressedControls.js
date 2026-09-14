import { useEffect, useRef, useState } from 'react'
import SpiceApi from './spiceapi.js'

const keyAliases = {
  ArrowUp: 'up', ArrowLeft: 'left', ArrowDown: 'down', ArrowRight: 'right',
  '7': '7', '8': '8', '9': '9', '4': '4', '5': '5', '6': '6',
  '1': '1', '2': '2', '3': '3', '0': '0', '.': 'D',
}

const directions = ['up', 'down', 'left', 'right']
const directionPatterns = {
  up: /(^|[^a-z])(up|uparrow|arrowup)([^a-z]|$)/,
  down: /(^|[^a-z])(down|downarrow|arrowdown)([^a-z]|$)/,
  left: /(^|[^a-z])(left|leftarrow|arrowleft)([^a-z]|$)/,
  right: /(^|[^a-z])(right|rightarrow|arrowright)([^a-z]|$)/,
}

function findDirection(names, direction) {
  const preferred = `P1 Menu ${direction[0].toUpperCase()}${direction.slice(1)}`
  return names.find((name) => name === preferred)
    || names.find((name) => directionPatterns[direction].test(name.toLowerCase()))
    || null
}

function isEditableTarget(target) {
  return target instanceof HTMLElement
    && (target.matches('input, textarea, select') || target.isContentEditable)
}

function usePressedControls({ host, port, password }) {
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

  const press = (id) => {
    setPressed((current) => new Set(current).add(id))
    if (directions.includes(id)) {
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
    if (directions.includes(id)) {
      sendDirection(id, false)
      return
    }
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
            directions.map((direction) => [direction, findDirection(names, direction)]),
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
