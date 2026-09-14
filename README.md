# React + Vite

## Conexion desde HTTPS

Cuando la interfaz se sirve por HTTPS, el navegador exige que el WebSocket use
`wss://`. La aplicacion se conecta automaticamente al mismo dominio por el
puerto 443; el proxy de ese dominio debe reenviar las conexiones WebSocket al
listener de Spice2x, normalmente `192.168.1.32:1338` si el puerto API es 1337.

Con acceso directo por HTTP, la aplicacion mantiene la conexion local directa a
`ws://<host>:<puerto API + 1>`.

Ejemplo de Nginx para el dominio:

```nginx
location / {
	proxy_pass http://127.0.0.1:5173;
}

location /spice-ws {
	proxy_pass http://192.168.1.32:1338;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "upgrade";
}
```

El listener WebSocket debe quedar publicado en la ruta que use el dominio.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
