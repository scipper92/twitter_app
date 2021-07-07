//const {pool} = require('../app')
const {Pool} = require('pg');

const pool = new Pool({
    user: "test",
    password: "test",
    host: "localhost",
    port: 5433,
    database: "test"
});

module.exports =  {
    insertNewUser: async function (body){
        const client = await pool.connect();
        try{
            await client.query("BEGIN");
            await client.query("INSERT INTO \"Registrations\" values($1,$2)",
                [body.name, body.email]);
            await client.query("COMMIT");
        } catch(ex) {
            console.log(`Transaction failed: ${ex}`);
            await client.query("ROLLBACK");
        } finally {
            client.release();
        }
    },
    
    insertNewPost: async function(body){
        const client = await pool.connect();
        records = null;
        try {
            await client.query("BEGIN");
            await client.query("INSERT INTO \"Twitter\" values($1,$2) RETURNING *",
                [body.name,body.post]);
            records =(await client.query("SELECT * FROM \"Twitter\"")).rows;
            await client.query("COMMIT");
        } catch (ex) {
            console.log(`Transaction failed: ${ex}`);
            await client.query("ROLLBACK");
        } finally {
            client.release();
        }
        return records.reverse();
    }, 
    
    selectAllPosts: async function(){
        const client = await pool.connect();
        rows = null;
        try{
            await client.query("BEGIN");
            rows = (await client.query("SELECT * FROM \"Twitter\"")).rows;
           // console.table(rows);
            await client.query("COMMIT");
        } catch (ex) {
            console.log(`Transaction failed: ${ex}`);
            await client.query("ROLLBACK");
        } finally {
            client.release();
        }
        //console.table(rows);
        return rows.reverse();
    },
    
}