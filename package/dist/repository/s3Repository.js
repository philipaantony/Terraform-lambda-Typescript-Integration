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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRepository = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({ region: 'us-east-1' });
const BUCKET_NAME = 's3-bucket-created-by-terraform1';
const FILE_KEY = 'todo.json';
const streamToString = (stream) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, stream_1, stream_1_1;
    var _b, e_1, _c, _d;
    const chunks = [];
    try {
        for (_a = true, stream_1 = __asyncValues(stream); stream_1_1 = yield stream_1.next(), _b = stream_1_1.done, !_b; _a = true) {
            _d = stream_1_1.value;
            _a = false;
            const chunk = _d;
            chunks.push(chunk);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_a && !_b && (_c = stream_1.return)) yield _c.call(stream_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Buffer.concat(chunks).toString('utf-8');
});
class TodoRepository {
    getTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new client_s3_1.GetObjectCommand({ Bucket: BUCKET_NAME, Key: FILE_KEY });
                const response = yield s3.send(command);
                const data = yield streamToString(response.Body);
                return JSON.parse(data);
            }
            catch (error) {
                console.error('Error fetching todos:', error);
                return [];
            }
        });
    }
    saveTodos(todos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: FILE_KEY,
                    Body: JSON.stringify(todos),
                });
                yield s3.send(command);
            }
            catch (error) {
                console.error('Error saving todos:', error);
            }
        });
    }
    updateTodoById(id, updatedTodo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield this.getTodos();
                const index = todos.findIndex(todo => todo.id === id);
                if (index !== -1) {
                    todos[index] = Object.assign(Object.assign({}, todos[index]), updatedTodo);
                    yield this.saveTodos(todos);
                }
                else {
                    throw new Error('Todo not found');
                }
            }
            catch (error) {
                console.error('Error updating todo:', error);
                throw error;
            }
        });
    }
    deleteTodoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield this.getTodos();
                const updatedTodos = todos.filter(todo => todo.id !== id);
                yield this.saveTodos(updatedTodos);
            }
            catch (error) {
                console.error('Error deleting todo:', error);
                throw error;
            }
        });
    }
}
exports.TodoRepository = TodoRepository;
