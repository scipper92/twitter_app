const express = require('express');
const { check,validationResult } = require('express-validator');
const db_executor = require('./db_executors');

const router = express.Router();
const records_per_page = 5;

function renderPage(res,records,page=1){
    current_records = records.slice((page-1)*records_per_page,page*records_per_page);
    console.table(current_records);
    res.render('form_post', {
        title: 'My Twitter App', 
        page_count: Math.ceil(records.length/records_per_page), 
        page: page,
        records: current_records
    });
}

router.get('/',(req,res) => {
    db_executor.selectAllPosts()
        .then(records => {
            console.table(records);
            current_page = parseInt(req.query.page) || 1;
            renderPage(res,records,current_page);
        });   
});

router.post('/',
    [
        check('name')
            .isAlpha()
            .withMessage('Please enter a name'),
        check('post')
            .isLength({min: 3})
            .withMessage('Please enter some text'),
    ], 
    (req,res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()){
            db_executor.insertNewPost(req.body)
                .then(records => {
                    console.table(records);
                    renderPage(res, records);
                });            
        } else {
            db_executor.selectAllPosts()
            .then(records => {
                console.table(records);
                res.render('form_post', {
                    title: 'My Twitter App',
                    errors: errors.array(),
                    data: req.body, 
                    page_count: Math.ceil(records.length/records_per_page), 
                    page: 1
                });
            });
        }
});

module.exports = router;