const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS todos (id integer primary key, title)');
  db.run('INSERT INTO todos(title) VALUES(?)', 'Eat biriyani');
  db.run('INSERT INTO todos(title) VALUES(?)', 'Drink some juice');
  db.run('INSERT INTO todos(title) VALUES(?)', 'go for shopping');
});

class Todo {

  constructor(id, title){
    this.id = id;
    this.title = title;
  }

  static all(callback){
    db.all('SELECT * FROM todos', callback);
  };

  static add(todo){
    const sql = 'INSERT INTO todos(title) VALUES(?)';
    db.run(sql, todo.title);
  };

  static update(todo, callback){
    const sql = 'UPDATE todos SET title = ? WHERE id = ?';
    db.run(sql, todo.title, todo.id, callback);
  };

  static delete(id, callback){
    const sql = 'DELETE FROM todos where id = ?';
    db.run(sql, id, callback);
  };

  static removeAll(){
    db.exec("delete from todos");
    //db.execSQL("delete from todos");
  }
  
}

module.exports = Todo;
