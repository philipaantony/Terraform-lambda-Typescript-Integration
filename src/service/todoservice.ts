import { TodoRepository } from '../repository/s3Repository';
import { Todo } from '../dto/todoDto';

export class TodoService {
    private todoRepository: TodoRepository;

    constructor() {
        this.todoRepository = new TodoRepository();
    }

    async getAllTodos(): Promise<Todo[]> {
        return await this.todoRepository.getTodos();
    }

    async addTodo(title: string): Promise<Todo> {
        const todos = await this.todoRepository.getTodos();
        const newTodo: Todo = { id: Date.now().toString(), title, completed: false };
        todos.push(newTodo);
        await this.todoRepository.saveTodos(todos);
        return newTodo;
    }

    async updateTodoById(id: string, updatedTodo: Todo): Promise<void> {
        try {
            await this.todoRepository.updateTodoById(id, updatedTodo);
        } catch (error) {
            throw error;
        }
    }

    async deleteTodoById(id: string): Promise<void> {
        try {
            await this.todoRepository.deleteTodoById(id);
        } catch (error) {
            throw error;
        }
    }

    
    
}
