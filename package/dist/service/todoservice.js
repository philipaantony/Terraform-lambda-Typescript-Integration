"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const s3Repository_1 = require("../repository/s3Repository");
class TodoService {
    constructor() {
        this.todoRepository = new s3Repository_1.TodoRepository();
    }
    getAllTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.todoRepository.getTodos();
        });
    }
    addTodo(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const todos = yield this.todoRepository.getTodos();
            const newTodo = { id: Date.now().toString(), title, completed: false };
            todos.push(newTodo);
            yield this.todoRepository.saveTodos(todos);
            return newTodo;
        });
    }
    updateTodoById(id, updatedTodo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.todoRepository.updateTodoById(id, updatedTodo);
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteTodoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.todoRepository.deleteTodoById(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.TodoService = TodoService;
