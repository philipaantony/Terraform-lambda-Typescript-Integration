import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { TodoService } from '../service/todoservice';

const todoService = new TodoService();

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const method = event.httpMethod;
    const path = event.path;
    const body = event.body ? JSON.parse(event.body) : null;

    try {
        if (method === 'GET' ) {
            const todos = await todoService.getAllTodos();
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(todos),
            });
        } else if (method === 'POST') {
            const newTodo = await todoService.addTodo(body.title);
            callback(null, {
                statusCode: 201,
                body: JSON.stringify(newTodo),
            });
        } else if (method === 'PATCH') {
            const todoId = event.pathParameters?.id;
            if (!todoId || !body) {
                callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid request. Provide ID and updated fields.' }),
                });
                return;
            }
            await todoService.updateTodoById(todoId, body);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ message: 'Todo updated successfully' }),
            });
        } else if (method === 'DELETE') {
            const todoId = event.pathParameters?.id;
            if (!todoId) {
                callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid request. Provide ID.' }),
                });
                return;
            }
            await todoService.deleteTodoById(todoId);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ message: 'Todo deleted successfully' }),
            });
        } else {
            callback(null, {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid request' }),
            });
        }
    } catch (error) {
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: (error as Error).message }),
        });
    }
};
