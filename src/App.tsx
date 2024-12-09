import { useEffect, useState } from "react";
import { generateClient } from '@aws-amplify/api';
import { GraphQLQuery } from '@aws-amplify/api';
import { fetchUserAttributes, FetchUserAttributesOutput } from 'aws-amplify/auth';
import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations';

type Todo = {
  id: string;
  name: string;
  description?: string;  // optional since it's not required in schema
  completed: boolean;
  userEmail: string;
};

type ListTodosQuery = {
  listTodos: {
    items: Todo[];
  };
};

const client = generateClient();

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [userAttributes, setUserAttributes] = useState<FetchUserAttributesOutput>();

  useEffect(() => {
    checkUser();
    if (userAttributes?.email) {
      fetchTodos();
    }
  }, [userAttributes?.email]);

  async function checkUser() {
    try {
      const attributes = await fetchUserAttributes();
      setUserAttributes(attributes);
    } catch (err) {
    }
  }

  async function fetchTodos() {
    if (!userAttributes?.email) return;
    try {
      const response = await client.graphql<GraphQLQuery<ListTodosQuery>>({
        query: queries.listTodos,
        variables: {
        filter: {
          userEmail: { eq: userAttributes.email }
        }
      }
      });
      if (response.data?.listTodos?.items) {
        setTodos(response.data.listTodos.items);
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  }

  async function createTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodoName.trim() || !userAttributes?.email) return;

    try {
      await client.graphql<GraphQLQuery<{ createTodo: Todo }>>({
        query: mutations.createTodo,
        variables: {
          input: {
            name: newTodoName,
            completed: false,
            description: newDescription || null,
            userEmail: userAttributes?.email
          }
        }
      });
      setNewTodoName("");
      setNewDescription("");
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }

  async function deleteTodo(id: string) {
    try {
      await client.graphql<GraphQLQuery<{ deleteTodo: { id: string } }>>({
        query: mutations.deleteTodo,
        variables: {
          id
        }
      });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  async function toggleComplete(id: string, completed: boolean) {
    try {
      await client.graphql<GraphQLQuery<{ updateTodo: Todo }>>({
        query: mutations.updateTodo,
        variables: {
          id,
          completed: !completed
        }
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="text-center mb-4">{userAttributes?.email} Todos</h1>

            {/* Todo Form */}
            <form onSubmit={createTodo} className="mb-4">
              <div className="mb-3">
                <input
                  type="text"
                  value={newTodoName}
                  onChange={(e) => setNewTodoName(e.target.value)}
                  placeholder="What needs to be done?"
                  className="form-control"
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add description (optional)"
                  className="form-control"
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Todo
                </button>
              </div>
            </form>

            {/* Todo List */}
            <div className="list-group">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="list-group-item"
                >
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id, todo.completed)}
                        className="form-check-input"
                      />
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <h5 className={todo.completed ? "text-decoration-line-through mb-1" : "mb-1"}>
                        {todo.name}
                      </h5>
                      {todo.description && (
                        <p className="text-muted small mb-0">
                          {todo.description}
                        </p>
                      )}
                      <p className="text-muted small mb-0">
                        <i className="bi bi-person"></i> {/* Bootstrap icon for person - optional */}
                        Assigned to: {todo.userEmail}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {todos.length === 0 && (
              <div className="text-center text-muted my-5">
                <p>No todos yet. Add one above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;