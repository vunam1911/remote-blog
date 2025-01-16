import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { store } from 'store'
// import * as Sentry from '@sentry/react'

// Sentry.init({
//     dsn: 'https://dc7eff766cc0fd21c85f4585deda8912@o4508639444664320.ingest.us.sentry.io/4508639449776128',
//     integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
//     // Tracing
//     tracesSampleRate: 1.0, //  Capture 100% of the transactions
//     // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//     tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
//     // Session Replay
//     replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//     replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
//     environment: process.env.NODE_ENV || 'development'
// })

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
