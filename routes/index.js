const express = require('express');
const mysql = require('mysql');

var router = express.Router();

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'imdb'
})

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/home', (req, res) => {  
    pool.query('SELECT * FROM imdb_top_1000', (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
router.get('/user-submit', (req, res) => {
    pool.query('SELECT * FROM imdb_top_user', (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
router.post('/submit', (req, res) => {
    let data = req.body;
    let insert_query = `INSERT INTO imdb_top_user(Poster_Link, Series_Title, Released_Year, Certificate, Runtime, Genre, IMDB_Rating, Overview, Meta_score, Director, Star1, Star2, Star3, Star4, No_of_Votes, Gross) VALUES("${data.poster_link}", "${data.series_title}", "${data.released_year}", "${data.cert}", "${data.runtime}", "${data.genre}", "${data.rating}", "${data.overview}", "${data.score}", "${data.director}", "${data.star1}", "${data.star2}", "${data.star3}", "${data.star4}", "${data.votes}", "${data.gross}")`;

    pool.query(insert_query, (err, result) => {
        if (err) throw err;
        res.send('data added');
    });
});
router.post('/update-input', (req, res) => {
    let data = req.body;
    let update_query = `UPDATE imdb_top_user SET Poster_Link = "${data.poster_link}", Series_Title = "${data.series_title}", Released_Year = "${data.released_year}", Certificate = "${data.cert}", Runtime = "${data.runtime}", Genre = "${data.genre}", IMDB_Rating = "${data.rating}", Overview = "${data.overview}", Meta_Score = "${data.score}", Director = "${data.director}", Star1 = "${data.star1}", Star2 = "${data.star2}", Star3 = "${data.star3}", Star4 = "${data.star4}", No_of_Votes = "${data.votes}", Gross = "${data.gross}" WHERE Series_Title = "${data.updateID}"`;

    pool.query(update_query, (err, result) => {
        if (err) throw err;
        res.send('data updated');
    });
});
router.post('/delete-input', (req, res) => {
    let delete_query = `DELETE FROM imdb_top_user WHERE Series_Title = "${req.body.deleteID}"`;

    pool.query(delete_query, (err, result) => {
        if (err) throw err;
        res.send('data deleted!');
    });
});
module.exports = router;