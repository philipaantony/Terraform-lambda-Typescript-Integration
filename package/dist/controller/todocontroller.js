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
exports.handler = void 0;
const todoservice_1 = require("../service/todoservice");
const todoService = new todoservice_1.TodoService();
const handler = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const method = event.httpMethod;
    const path = event.path;
    const body = event.body ? JSON.parse(event.body) : null;
    try {
        if (method === 'GET') {
            const todos = yield todoService.getAllTodos();
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(todos),
            });
        }
        else if (method === 'POST') {
            const newTodo = yield todoService.addTodo(body.title);
            callback(null, {
                statusCode: 201,
                body: JSON.stringify(newTodo),
            });
        }
        else if (method === 'PATCH') {
            const todoId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
            if (!todoId || !body) {
                callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid request. Provide ID and updated fields.' }),
                });
                return;
            }
            yield todoService.updateTodoById(todoId, body);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ message: 'Todo updated successfully' }),
            });
        }
        else if (method === 'DELETE') {
            const todoId = (_b = event.pathParameters) === null || _b === void 0 ? void 0 : _b.id;
            if (!todoId) {
                callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid request. Provide ID.' }),
                });
                return;
            }
            yield todoService.deleteTodoById(todoId);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ message: 'Todo deleted successfully' }),
            });
        }
        else {
            callback(null, {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid request' }),
            });
        }
    }
    catch (error) {
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: error.message }),
        });
    }
});
exports.handler = handler;
