import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Todo } from '../dto/todoDto';
import { Readable } from 'stream';

const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET_NAME = 's3-bucket-created-by-terraform1';
const FILE_KEY = 'todo.json';

const streamToString = async (stream: Readable): Promise<string> => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks).toString('utf-8');
};

export class TodoRepository {
    async getTodos(): Promise<Todo[]> {
        try {
            const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: FILE_KEY });
            const response = await s3.send(command);
            const data = await streamToString(response.Body as Readable);
            return JSON.parse(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
            return [];
        }
    }

    async saveTodos(todos: Todo[]): Promise<void> {
        try {
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: FILE_KEY,
                Body: JSON.stringify(todos),
            });
            await s3.send(command);
        } catch (error) {
            console.error('Error saving todos:', error);
        }
    }

    async updateTodoById(id: string, updatedTodo: Todo): Promise<void> {
        try {
            const todos = await this.getTodos();
            const index = todos.findIndex(todo => todo.id === id);
            if (index !== -1) {
                todos[index] = { ...todos[index], ...updatedTodo };
                await this.saveTodos(todos);
            } else {
                throw new Error('Todo not found');
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    }

    async deleteTodoById(id: string): Promise<void> {
        try {
            const todos = await this.getTodos();
            const updatedTodos = todos.filter(todo => todo.id !== id);
            await this.saveTodos(updatedTodos);
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    }

    
}
