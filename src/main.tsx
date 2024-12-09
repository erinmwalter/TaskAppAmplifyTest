import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../amplify/data/resource';
import "bootstrap/dist/css/bootstrap.css";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './Navbar';


const config = {
  "aws_project_region": "us-east-1",
  "aws_appsync_graphqlEndpoint": "https://szzkjn4za5bfvo7mnxvx5rhzem.appsync-api.us-east-1.amazonaws.com/graphql",
  "aws_appsync_region": "us-east-1",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "da2-fsuyp5agpbaa7d6t3aegilufky",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "us-east-1_Aeza1WSdl",
  "aws_user_pools_web_client_id": "3apj3egvae466t8obgtm9q5nnd"
}

// Configure Amplify before anything else
Amplify.configure(config);
// Generate client after configuration
export const client = generateClient<Schema>();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Authenticator>
    <Navbar/>
    <App/>
    </Authenticator>
  </React.StrictMode>
);


