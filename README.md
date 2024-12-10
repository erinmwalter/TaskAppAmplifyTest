# AWS Amplify React TypeScript Tutorial

This tutorial will guide you through creating a full-stack application using AWS Amplify with React and TypeScript.

## Prerequisites
- Node.js installed (v14.x or later)
- AWS account
- AWS Amplify CLI installed (`npm install -g @aws-amplify/cli`)
- AWS Amplify CLI configured (`amplify configure`)

## Step 1: Create Project Directory
```bash
mkdir my-amplify-app
cd my-amplify-app
```

## Step 2: Initialize React TypeScript Application
```bash
npx create-react-app . --template typescript
```

## Step 3: Initialize Amplify
First, install required dependencies:
```bash
npm install aws-amplify @aws-amplify/ui-react
```

Then initialize Amplify in your project:
```bash
amplify init
```

You'll be prompted to:
- Enter a name for the project
- Choose your default editor
- Choose the type of app (JavaScript)
- Choose your default JavaScript framework (React)
- Source directory path (src)
- Distribution directory path (build)
- Build command (npm run build)
- Start command (npm start)

## Step 4: Add GraphQL API
```bash
amplify add api
```

Select the following options:
- Choose GraphQL
- Enter API name (e.g., myapi)
- Choose authorization type (API key for simplicity)
- Enter days for API key expiration
- Choose conflict resolution strategy
- Select "Single object with fields" schema template

The schema will be created in `amplify/backend/api/myapi/schema.graphql`. Update it as needed:

```graphql
type Todo @model {
  id: ID!
  content: String!
  isCompleted: Boolean!
}
```

## Step 5: Add Authentication
```bash
amplify add auth
```

Choose:
- Default configuration
- Username/Email for sign-in
- Configure additional security features if needed

## Step 6: Configure React Application

### Create src/config.json:
```json
{
  "aws_project_region": "YOUR_REGION",
  "aws_cognito_region": "YOUR_REGION",
  "aws_user_pools_id": "YOUR_USER_POOL_ID",
  "aws_user_pools_web_client_id": "YOUR_CLIENT_ID",
  "aws_appsync_graphqlEndpoint": "YOUR_GRAPHQL_ENDPOINT",
  "aws_appsync_region": "YOUR_REGION",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "YOUR_API_KEY"
}
```
You'll get these values after running `amplify push`. They can be found in your AWS Console:
- User Pool ID and Web Client ID: Cognito > User Pools > Your Pool
- GraphQL Endpoint and API Key: AppSync > Your API > Settings
- Region: Your selected AWS region (e.g., "us-east-1")

## Step 7: Configure React Application

### Update src/index.tsx:
```typescript
Amplify.configure(config);
export const client = generateClient<Schema>();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Authenticator>
      <App/>
    </Authenticator>
  </React.StrictMode>
);
```

### Update src/App.tsx:
```typescript
import { useAuthenticator } from '@aws-amplify/ui-react';

function App() {
  const { signOut } = useAuthenticator();

  return (
    <div className="container mt-4">
      <h1>Hello, Amplify!</h1>
      <button className="btn btn-primary" onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default App;
```

## Step 8: Deploy Backend
```bash
amplify push
```
- This will create the AWS resources
- Say yes to generating code for your GraphQL API

## Step 9: Test Your Application Locally 
```bash
npm start
```

Visit http://localhost:3000 to see your app running.

## Step 9: Deploy Frontend
```bash
amplify publish
```

## Additional Configuration

### Environment Variables
Create a `.env` file in your project root:
```
GENERATE_SOURCEMAP=false
```

### GraphQL Operations
Create a `src/graphql` folder and add your operations:

```typescript
export const createTodo = /* GraphQL */ `
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      content
      isCompleted
    }
  }
`;
```

### Add Bootstrap Styling
```bash
npm install bootstrap
```

Add to src/main.tsx:
```typescript
import 'bootstrap/dist/css/bootstrap.min.css';
```

## Common Issues and Solutions

### 401 Unauthorized Error
If you encounter a 401 error, check:
- Your API configuration in aws-exports.js
- Authentication setup
- API key expiration

### GraphQL Errors
If you encounter GraphQL errors:
- Verify your schema matches your queries/mutations
- Check your API endpoint configuration
- Ensure you're using the correct authorization type

## Useful Commands

```bash
# Check Amplify status
amplify status

# Pull latest backend environment
amplify pull

# Push local changes to cloud
amplify push

# Publish frontend and backend changes
amplify publish

# Remove Amplify project
amplify delete
```

## Resources
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
